import {onRequest} from "firebase-functions/v2/https";
import {Storage} from "@google-cloud/storage";
import { SimpleSplitChannelScore } from "./monophonic";
import { ClientOstinatoData,clientDataToTemplate  } from "./helpers";

exports.buildOstinato = onRequest(
  {cors: true},
  async (req, res) => {
    const storage = new Storage();
    const successes = [];

    try { 
      successes.push(`received message`);
      const ostinatoTemplate = req.body.ostinato as ClientOstinatoData;
      successes.push(`assigned ostinato ${req.body.toString()}`);
      const score = new SimpleSplitChannelScore(...clientDataToTemplate(ostinatoTemplate));
      successes.push(`created score template`);
      const buffer = score.buildScoreBuffer();
      successes.push(`built buffer ${buffer.toString()}`);
      const bucket = storage.bucket(req.body.bucket);
      const file = bucket.file(`scores/${req.body.path}.bin`);
      await file.save(buffer, {
        metadata: {
                contentType: "application/octet-stream",
        },
    });
      successes.push(`uploaded score`);
      res.status(200).send({text:`ostinato buffer score built`});
    }
     catch (err) {
      res.status(500).send({text: `Error creating and uploading File,`, successes: successes.join('\n')});
    }
  }
);
