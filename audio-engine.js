// 실제 자연 녹음(Field Recording) 듀얼 레이어 비반복 엔진 + 정밀 주파수 합성 하이브리드 오디오 엔진

class NatureAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;

    this.channels = new Map(); // soundId -> channelInstance
    this.masterVolume = 0.8;
    this.isMuted = false;

    // 매장용 비단조로움(유기적 자연 변화) 강도: 0.0 ~ 1.0
    this.organicDriftAmount = 0.75;
    this.driftTimer = null;
    this.noiseBuffers = {};
    this.visPhase = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.createNoiseBuffers();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.driftTimer) {
      this.startOrganicDriftLoop();
    }
  }

  createNoiseBuffers() {
    const rate = this.ctx.sampleRate;
    const length = rate * 10;

    // 1. White Noise
    const whiteBuf = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const out = whiteBuf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        out[i] = Math.random() * 2 - 1;
      }
    }
    this.noiseBuffers.white = whiteBuf;

    // 2. Pink Noise
    const pinkBuf = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const out = pinkBuf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }
    }
    this.noiseBuffers.pink = pinkBuf;

    // 3. Brown Noise
    const brownBuf = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const out = brownBuf.getChannelData(ch);
      let lastOut = 0.0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        out[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = out[i];
        out[i] *= 3.2;
      }
    }
    this.noiseBuffers.brown = brownBuf;
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && !this.isMuted && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.08);
    }
    this.channels.forEach(ch => this.updateChannelGain(ch));
  }

  setMute(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
    this.channels.forEach(ch => this.updateChannelGain(ch));
  }

  setOrganicDrift(amount) {
    this.organicDriftAmount = Math.max(0, Math.min(1, amount));
  }

  setSoundState(soundDef, volume, density = null) {
    this.init();
    const id = soundDef.id;
    let ch = this.channels.get(id);

    if (volume <= 0.001) {
      if (ch) {
        this.stopChannel(id);
      }
      return;
    }

    if (!ch) {
      ch = this.createChannel(soundDef, volume, density ?? soundDef.defaultDensity ?? 0.65);
      this.channels.set(id, ch);
    } else {
      ch.baseVolume = volume;
      if (density !== null) {
        ch.density = density;
        this.updateChannelDensity(ch);
      }
      this.updateChannelGain(ch);
    }
  }

  updateChannelGain(ch) {
    if (ch.stopped) return;
    const muteFactor = this.isMuted ? 0 : this.masterVolume;
    const drift1 = 1 + (ch.currentDriftOffsetA || 0) * this.organicDriftAmount;
    const drift2 = 1 + (ch.currentDriftOffsetB || 0) * this.organicDriftAmount;

    // 1) 실제 녹음 오디오 엘리먼트 볼륨 업데이트
    if (ch.playerA) {
      const distA = ch.callDistanceGainA ?? 1.0;
      const vA = Math.max(0, Math.min(1, ch.baseVolume * muteFactor * drift1 * distA));
      ch.playerA.volume = vA;
    }
    if (ch.playerB) {
      // 보조 레이어는 밀도(density)와 비단조로움 설정에 따라 풍성함을 더함
      const layerRatio = ch.playStyle === 'continuous'
        ? (0.45 + ch.density * 0.45)
        : (ch.density >= 0.55 ? (ch.density - 0.35) * 0.85 : 0);
      const distB = ch.callDistanceGainB ?? 0.75;
      const vB = Math.max(0, Math.min(1, ch.baseVolume * muteFactor * drift2 * layerRatio * distB));
      ch.playerB.volume = vB;
    }

    // 2) 주파수/노이즈 Web Audio 노드 볼륨 업데이트
    if (ch.gainNode && this.ctx) {
      const effectiveVol = Math.max(0, Math.min(1.2, ch.baseVolume * drift1));
      ch.gainNode.gain.setTargetAtTime(effectiveVol, this.ctx.currentTime, 0.15);
    }
  }

  updateChannelDensity(ch) {
    if (ch.stopped) return;
    this.updateChannelGain(ch);
  }

  stopChannel(id) {
    const ch = this.channels.get(id);
    if (!ch) return;
    ch.stopped = true;

    if (ch.timers) {
      ch.timers.forEach(t => clearTimeout(t));
      ch.timers = [];
    }

    if (ch.playerA) {
      try {
        ch.playerA.pause();
        ch.playerA.src = '';
      } catch (e) {}
    }
    if (ch.playerB) {
      try {
        ch.playerB.pause();
        ch.playerB.src = '';
      } catch (e) {}
    }

    if (ch.gainNode && this.ctx) {
      ch.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
    setTimeout(() => {
      if (ch.nodes) {
        ch.nodes.forEach(n => {
          try {
            if (n.stop) n.stop();
            if (n.disconnect) n.disconnect();
          } catch (e) {}
        });
      }
    }, 200);

    this.channels.delete(id);
  }

  stopAll() {
    Array.from(this.channels.keys()).forEach(id => this.stopChannel(id));
  }

  // 매장 장시간 재생을 위한 유기적 변화(Drift) 루프
  startOrganicDriftLoop() {
    if (this.driftTimer) clearInterval(this.driftTimer);
    let tick = 0;
    this.driftTimer = setInterval(() => {
      tick += 0.25;
      this.channels.forEach((ch) => {
        if (ch.stopped) return;

        // 두 개의 비동기 사인파 합성으로 자연스러운 강약 호흡 생성
        const w1 = Math.sin(tick * ch.driftFreq1 + ch.driftPhase1);
        const w2 = Math.cos(tick * ch.driftFreq2 + ch.driftPhase2);
        ch.currentDriftOffsetA = (w1 * 0.6 + w2 * 0.4) * 0.22;
        ch.currentDriftOffsetB = (-w1 * 0.5 + w2 * 0.5) * 0.25;

        this.updateChannelGain(ch);

        // 실제 녹음 오디오의 재생 속도(피치/호흡)도 아주 미세하게 숨쉬듯 변화시켜 루프의 기계적 느낌 완전 제거
        if (ch.playerA && ch.playStyle === 'continuous' && this.organicDriftAmount > 0.05) {
          const baseR = (ch.soundDef.baseRate || 1.0) * (ch.soundDef.pitchShift || 1.0);
          const rateMod = 1 + (w2 * 0.03 * this.organicDriftAmount);
          const nextRate = Math.max(0.35, Math.min(2.0, baseR * rateMod));
          if (!ch.playerA.paused) {
            try { ch.playerA.playbackRate = nextRate; } catch (e) {}
          }
        }

        // 노이즈 필터 드리프트
        if (ch.driftFilter && ch.baseFilterFreq && this.ctx) {
          const mod = 1 + (w1 * 0.3 + w2 * 0.2) * this.organicDriftAmount;
          const nextFreq = Math.max(60, Math.min(12000, ch.baseFilterFreq * mod));
          ch.driftFilter.frequency.setTargetAtTime(nextFreq, this.ctx.currentTime, 0.4);
        }
      });
    }, 500);
  }

  createChannel(soundDef, volume, density) {
    const ch = {
      id: soundDef.id,
      soundDef,
      baseVolume: volume,
      density: density,
      playStyle: soundDef.playStyle || 'continuous',
      nodes: [],
      timers: [],
      stopped: false,
      pitchShift: soundDef.pitchShift || 1.0,
      driftPhase1: Math.random() * Math.PI * 2,
      driftPhase2: Math.random() * Math.PI * 2,
      driftFreq1: 0.07 + Math.random() * 0.08,
      driftFreq2: 0.03 + Math.random() * 0.05,
      currentDriftOffsetA: 0,
      currentDriftOffsetB: 0,
      callDistanceGainA: 1.0,
      callDistanceGainB: 0.72
    };

    const primaryUrl = soundDef.customAudioUrl || soundDef.audioUrl || soundDef.streamUrl;
    if (primaryUrl) {
      this.setupRealRecordingChannel(ch, primaryUrl, soundDef.secondaryAudioUrl || primaryUrl);
      return ch;
    }

    // 순수 주파수(432Hz, 528Hz, 슈만공명, 세타파) 및 백색/핑크/브라운 노이즈는 정밀 Web Audio 엔진 사용
    const now = this.ctx.currentTime;
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.setTargetAtTime(volume, now, 0.25);
    gainNode.connect(this.masterGain);
    ch.gainNode = gainNode;
    ch.nodes.push(gainNode);

    this.setupPrecisionFrequencyOrNoise(ch, soundDef.synthType || 'noise_pink');
    return ch;
  }

  // 실제 현장 녹음(Field Recording) 재생기: 끊김 없는 이중 교차 루프 & 비주기적 간격 스케줄링
  setupRealRecordingChannel(ch, urlA, urlB) {
    const baseRate = (ch.soundDef.baseRate || 1.0) * (ch.soundDef.pitchShift || 1.0);

    const createAudioEl = (url, rate) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      if ('preservesPitch' in audio) audio.preservesPitch = false;
      if ('mozPreservesPitch' in audio) audio.mozPreservesPitch = false;
      if ('webkitPreservesPitch' in audio) audio.webkitPreservesPitch = false;
      try {
        audio.playbackRate = Math.max(0.3, Math.min(2.5, rate));
      } catch (e) {}
      return audio;
    };

    if (ch.playStyle === 'continuous') {
      // 1) 연속 배경음 (바람, 빗소리, 시냇물, 물속 수중음, 전통 시장, 아이들 소리, 카페, 모닥불, 새 합창 등)
      // 두 개의 오디오 레이어를 서로 다른 위치와 미세하게 다른 속도로 동시 재생하여 루프 이음매를 완벽히 감추고 패턴이 단조롭지 않게 함
      const playerA = createAudioEl(urlA, baseRate);
      const playerB = createAudioEl(urlB, baseRate * 0.93);
      playerA.loop = true;
      playerB.loop = true;

      ch.playerA = playerA;
      ch.playerB = playerB;
      this.updateChannelGain(ch);

      playerA.play().catch(err => console.warn('오디오 재생 오류 A:', err));

      // playerB는 전체 길이의 45% 지점부터 시작하여 playerA와 위상이 절대 겹치지 않게 함
      playerB.addEventListener('loadedmetadata', () => {
        if (ch.stopped) return;
        if (playerB.duration && isFinite(playerB.duration) && playerB.duration > 2) {
          playerB.currentTime = playerB.duration * (0.4 + Math.random() * 0.2);
        }
        playerB.play().catch(() => {});
      }, { once: true });

    } else {
      // 2) 에피소드/울음소리형 실제 녹음 (뻐꾸기, 소쩍새, 참새, 딱따구리, 갈매기, 귀뚜라미, 개구리, 풍경, 싱잉볼 타격 등)
      // 녹음본이 끝날 때마다 밀도(density) 슬라이더와 랜덤성에 따라 자연스러운 여백(쉬는 시간)과 원근감(볼륨/피치 미세 변화)을 주어 실제 자연처럼 연출
      const playerA = createAudioEl(urlA, baseRate);
      const playerB = createAudioEl(urlB, baseRate * 0.92);
      playerA.loop = false;
      playerB.loop = false;

      ch.playerA = playerA;
      ch.playerB = playerB;
      this.updateChannelGain(ch);

      const triggerNextTake = (player, isSecondary) => {
        if (ch.stopped) return;
        // 원근감(거리감) 랜덤 변화: 멀리서 들릴 때와 가까이서 들릴 때의 자연스러운 차이
        const distVar = 0.65 + Math.random() * 0.35;
        if (isSecondary) {
          ch.callDistanceGainB = distVar * 0.78;
        } else {
          ch.callDistanceGainA = distVar;
        }
        this.updateChannelGain(ch);

        // 피치/속도도 매번 ±4% 범위에서 자연스럽게 변화
        const organicPitch = baseRate * (0.95 + Math.random() * 0.10) * (isSecondary ? 0.92 : 1.0);
        try {
          player.playbackRate = Math.max(0.35, Math.min(2.2, organicPitch));
          player.currentTime = 0;
        } catch (e) {}

        player.play().catch(() => {});
      };

      playerA.addEventListener('ended', () => {
        if (ch.stopped) return;
        // 빈도/밀도(density: 0.1 ~ 1.0)가 높을수록 쉬는 시간이 짧고, 낮을수록 여유 있게 울림
        const restBase = Math.max(0.15, (1.05 - ch.density) * 5.5);
        const randomWaitMs = (restBase * (0.4 + Math.random() * 1.1)) * 1000;
        const tid = setTimeout(() => triggerNextTake(playerA, false), randomWaitMs);
        ch.timers.push(tid);
      });

      playerB.addEventListener('ended', () => {
        if (ch.stopped) return;
        const restBase = Math.max(0.8, (1.15 - ch.density) * 7.5);
        const randomWaitMs = (restBase * (0.6 + Math.random() * 1.2)) * 1000;
        const tid = setTimeout(() => {
          if (ch.density >= 0.55) {
            triggerNextTake(playerB, true);
          }
        }, randomWaitMs);
        ch.timers.push(tid);
      });

      // 첫 재생 시작
      triggerNextTake(playerA, false);

      // 보조 레이어(두 번째 새/공명)는 2~4초 뒤 엇박자로 합류
      const secondTid = setTimeout(() => {
        if (!ch.stopped && ch.density >= 0.55) {
          triggerNextTake(playerB, true);
        }
      }, 1800 + Math.random() * 2400);
      ch.timers.push(secondTid);
    }
  }

  createLoopingNoiseNode(type = 'pink') {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffers[type] || this.noiseBuffers.pink;
    src.loop = true;
    src.start(0, Math.random() * 8);
    return src;
  }

  setupPrecisionFrequencyOrNoise(ch, synthType) {
    const pShift = ch.pitchShift || 1.0;

    switch (synthType) {
      case 'res_432hz': {
        this.createContinuousHarmonicPad(ch, 432 * pShift, [0.5, 1.0, 1.5, 2.0], [0.35, 0.45, 0.15, 0.06]);
        break;
      }
      case 'res_528hz': {
        this.createContinuousHarmonicPad(ch, 528 * pShift, [0.5, 1.0, 1.5], [0.35, 0.48, 0.14]);
        break;
      }
      case 'res_schumann': {
        this.createBinauralDrone(ch, 136.1 * pShift, 7.83);
        break;
      }
      case 'res_theta': {
        const beatFreq = 6.0 * pShift;
        this.createBinauralDrone(ch, 200 * pShift, beatFreq);
        break;
      }
      case 'res_om_drone': {
        this.createContinuousHarmonicPad(ch, 136.1 * pShift, [0.5, 1.0, 1.5, 2.0], [0.4, 0.5, 0.2, 0.1]);
        break;
      }
      case 'noise_pink': {
        const src = this.createLoopingNoiseNode('pink');
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 3600 * pShift;
        ch.driftFilter = lp;
        ch.baseFilterFreq = 3600 * pShift;
        src.connect(lp);
        lp.connect(ch.gainNode);
        ch.nodes.push(src, lp);
        break;
      }
      case 'noise_brown': {
        const src = this.createLoopingNoiseNode('brown');
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 850 * pShift;
        ch.driftFilter = lp;
        ch.baseFilterFreq = 850 * pShift;
        src.connect(lp);
        lp.connect(ch.gainNode);
        ch.nodes.push(src, lp);
        break;
      }
      case 'noise_white': {
        const src = this.createLoopingNoiseNode('white');
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 5200 * pShift;
        ch.driftFilter = lp;
        ch.baseFilterFreq = 5200 * pShift;
        const g = this.ctx.createGain();
        g.gain.value = 0.25;
        src.connect(lp);
        lp.connect(g);
        g.connect(ch.gainNode);
        ch.nodes.push(src, lp, g);
        break;
      }
      case 'noise_vinyl': {
        const src = this.createLoopingNoiseNode('pink');
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1400 * pShift;
        bp.Q.value = 0.9;
        const g = this.ctx.createGain();
        g.gain.value = 0.22;
        src.connect(bp);
        bp.connect(g);
        g.connect(ch.gainNode);
        ch.nodes.push(src, bp, g);
        break;
      }
      default: {
        const src = this.createLoopingNoiseNode('pink');
        src.connect(ch.gainNode);
        ch.nodes.push(src);
      }
    }
  }

  createContinuousHarmonicPad(ch, baseFreq, ratios, gains) {
    ratios.forEach((ratio, idx) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      const detune = (idx % 2 === 0 ? 1 : -1) * (0.15 * idx);
      osc.frequency.value = baseFreq * ratio + detune;
      g.gain.value = (gains[idx] || 0.1) * 0.45;
      osc.connect(g);
      g.connect(ch.gainNode);
      osc.start();
      ch.nodes.push(osc, g);
    });
  }

  createBinauralDrone(ch, carrierFreq, beatFreq) {
    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    const panL = this.ctx.createStereoPanner();
    const panR = this.ctx.createStereoPanner();
    const g = this.ctx.createGain();

    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.value = carrierFreq - beatFreq / 2;
    oscR.frequency.value = carrierFreq + beatFreq / 2;

    panL.pan.value = -0.75;
    panR.pan.value = 0.75;
    g.gain.value = 0.28;

    oscL.connect(panL);
    oscR.connect(panR);
    panL.connect(g);
    panR.connect(g);
    g.connect(ch.gainNode);

    oscL.start();
    oscR.start();
    ch.nodes.push(oscL, oscR, panL, panR, g);
  }

  // 상단 스펙트럼 비주얼라이저용 데이터 반환 (실제 녹음 채널 활성도 + Web Audio 주파수 결합)
  getFrequencyData() {
    const bins = 64;
    const arr = new Uint8Array(bins);
    if (this.analyser) {
      this.analyser.getByteFrequencyData(arr);
    }

    if (this.isMuted || this.channels.size === 0) {
      return arr;
    }

    this.visPhase += 0.12;
    let totalRealEnergy = 0;
    this.channels.forEach(ch => {
      if (!ch.stopped && ch.baseVolume > 0.01) {
        const playingA = ch.playerA && !ch.playerA.paused;
        const playingB = ch.playerB && !ch.playerB.paused;
        if (playingA || playingB) {
          totalRealEnergy += ch.baseVolume * this.masterVolume;
        }
      }
    });

    if (totalRealEnergy > 0.01) {
      const clampedEnergy = Math.min(1.4, totalRealEnergy);
      for (let i = 0; i < bins; i++) {
        const wave = Math.sin(this.visPhase + i * 0.35) * 0.5 + 0.5;
        const wave2 = Math.cos(this.visPhase * 0.7 - i * 0.2) * 0.5 + 0.5;
        const bandCurve = Math.exp(-i / 28);
        const simVal = (wave * 0.6 + wave2 * 0.4) * bandCurve * clampedEnergy * 210;
        arr[i] = Math.min(255, Math.max(arr[i], Math.floor(simVal)));
      }
    }

    return arr;
  }
}

window.NatureAudioEngine = NatureAudioEngine;
