import { EventEmitter, Injectable } from '@angular/core';
import * as RNBO from '@rnbo/js';
import { AudioService } from '../webAPI/audio.service';
import { FirebaseLoaderService } from 'src/app/services/firebase/firebase-loader.service';
interface Track {
  url: string;
  index: string | number;
}
type connection = [number?, number?];
interface ConnectionMap {
  sourceMap?: Record<string, connection>; // ID, output, input
  sinkMap?: Record<string, connection>;
}
interface DeviceLoadOptions {
  logDevice?: boolean;
  logPatcher?: boolean;
  connections?: ConnectionMap;
}
export enum DeviceLifecycleEvents {
  load,
  start,
  stop,
  destroy
}

export type DeviceLifecycleEvent = `${keyof(typeof DeviceLifecycleEvents)}${'ing'|'ed'}`;
@Injectable({
  providedIn: 'root',
})
export class RnboLoaderService {
  devices: Map<string, RNBO.BaseDevice | null> = new Map();
  lifecycle: EventEmitter<[string, DeviceLifecycleEvent]> = new EventEmitter();
  constructor(
    private webAudio: AudioService,
    private fbLoader: FirebaseLoaderService
  ) { }
async loadDeviceList(): Promise<string[]> {
  let deviceList = await this.fbLoader.listStorageNames('devices/');
  deviceList.forEach((name: string) => console.log(`found device: ${name}`));
  deviceList.forEach((name: string) => this.devices.set(name, null));
  return deviceList;
}

// change url in track to the pokemon name - getBytes doesn;t use the downlaodURL

  async loadPlaylist(tgt_device: string, tracks: Track[]) {
    const device = this.devices.get(tgt_device);
    if (!device) {
      throw new Error(`device ${tgt_device} not loaded exist`);
    }
    for await (const track of tracks) {
      console.log(`fetching url ${track.url}`);
      const audioBuf = await this.fbLoader.loadAudio(
        this.webAudio.ctx,
        track.url
      );
      let buf_id =
        typeof track.index === 'number'
          ? device.dataBufferDescriptions?.[track.index]?.id
          : device.dataBufferDescriptions.find(
              (buf) => (buf.id = track.index as string)
            )?.id;
      if (buf_id) {
        console.log(`setting buffer: ${buf_id} to audio in file ${track.url}`);
        await device.setDataBuffer(buf_id, audioBuf);
      }
    }
  }
  async loadPatcher(id: string, logPatcher?: boolean) {
    let patcher = await this.fbLoader.loadJSON(`devices/${id}.export`);
    if (logPatcher) {
      this.patcher_info_logger(id, patcher);
    }
    return patcher;
  }
  async loadDevice(
    device_id: string,
    options?: DeviceLoadOptions
  ): Promise<RNBO.BaseDevice | null> {
    let device: RNBO.BaseDevice;
    try {
      const context = this.webAudio.ctx;
      const patcher = await this.loadPatcher(device_id, true);
      device = await RNBO.createDevice({ context, patcher });
      this.devices.set(device_id, device);
      this.webAudio.addNode(device_id, device.node, options?.connections);
      if (options?.logDevice) {
        this.device_info_logger(device_id, device);
      }
    } catch (err) {
      throw err;
    }
    return device;
  }
  async loadScoreList(device_category: string): Promise<string[]> {
    let scoreList = await this.fbLoader.listStorageNames(`scores/${device_category}`);
    scoreList.forEach((name: string) => console.log(`found device: ${name}`));
    scoreList.forEach((name: string) => this.devices.set(name, null));
    return scoreList;

  }
  async loadScore(deviceID: string, score_id: string) {
    let categories = deviceID.split('_');
    console.log(`loading score at scores/${categories[1]}_${categories[2]}/${score_id}.bin`);
    let scoreData = await this.fbLoader.loadScore(`scores/${categories[1]}_${categories[2]}/${score_id}.bin`);
    let scoreBuffer = new Float32Array(scoreData);
    console.log(`logging score ${score_id} with length ${scoreData.byteLength}`);
    scoreBuffer.forEach((val, index) => {
        console.log(`${index}: ${val}`);
    });
    return this.loadBuffer(deviceID, 'score', scoreData, +categories[1]);
  }
  async loadBuffer(
    deviceID: string | RNBO.BaseDevice,
    bufferID: string | number,
    buffer_src: string | AudioBuffer | ArrayBuffer | Float32Array,
    channelCount?: number
  ): Promise<void> {
    try {
      let buffer: AudioBuffer | Float32Array | ArrayBuffer;
      const device =
        typeof deviceID === 'string' ? this.devices.get(deviceID) : deviceID;
      if (!device) {
        throw new Error(`device ${deviceID} does not exist`);
      }
      if (typeof buffer_src === 'string') {
        buffer = await this.fbLoader.loadAudio(this.webAudio.ctx, buffer_src);
      } else {
        buffer = buffer_src;
      }
      let buf_id =
        typeof bufferID === 'string'
          ? bufferID
          : device.dataBufferDescriptions[bufferID]?.id;
      if (buffer instanceof ArrayBuffer || buffer instanceof Float32Array) {
        let cc = channelCount ?? 1;
        let sr = this.webAudio.ctx?.sampleRate ?? 44100;
        return device.setDataBuffer(buf_id, buffer, cc, sr);
      } else if (buffer instanceof AudioBuffer) {
        return device.setDataBuffer(buf_id, buffer);
      } else {
        throw new Error('array buffer input is missing channel count argument');
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  patcher_info_logger(device_id: string, patcher_obj: RNBO.IPatcher) {
    console.log(`logging patcher object for rnbo device with id ${device_id}`);
    console.log(patcher_obj);
  }
  device_info_logger(device_id: string, device: RNBO.BaseDevice) {
    console.log(`logging info for rnbo device: ${device_id} of type ${device.type} and source type ${device.sourceType}`);


    console.log('parameters: ');
    device.parametersById.forEach((param, id) => {
      console.log(`id: ${id}`);
      console.log(param);
    });

    console.log('messages: ');
    device.messages.forEach((msg) => {
      console.log(`tag: ${msg.tag}`);
      if ('meta' in msg) {
        console.log(msg.meta);
      }
    });

    console.log('buffers: ');
    device.dataBufferDescriptions.forEach((buf) => {
      console.log(`id: ${buf.id}`);
      console.log(`type: ${buf.type}`);
    });
    console.log('audioNode: ');
    console.log(device.node);
  }
  // Could add loadPreset, loadScore, etc... anything stored as a file
}
