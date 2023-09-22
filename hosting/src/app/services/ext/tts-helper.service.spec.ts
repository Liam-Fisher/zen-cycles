import { TestBed } from '@angular/core/testing';

import { TtsHelperService } from './tts-helper.service';

describe('TtsHelperService', () => {
  let service: TtsHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TtsHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
