/**
 * Sound Synthesizer via Web Audio API
 * Generates an organic mechanical click with zero audio assets.
 */

let audioCtx = null;

export function isSoundEnabled() {
  try {
    return localStorage.getItem('sound.v1') === 'on';
  } catch (e) {
    return false;
  }
}

export function setSoundEnabled(enable) {
  try {
    localStorage.setItem('sound.v1', enable ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent('sound:change', { detail: { enabled: enable } }));
  } catch (e) {}
}

export function playMechanicalClick() {
  if (!isSoundEnabled()) return;
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const bufferSize = Math.floor(0.03 * audioCtx.sampleRate);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // Decaying white noise
    for (let i = 0; i < data.length; i++) {
      data[i] = (2 * Math.random() - 1) * Math.pow(1 - i / data.length, 6);
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    // 2400Hz Bandpass filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.9;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.15, now);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    source.start(now);
  } catch (e) {}
}

export function initSoundTriggers() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, [role="button"], input[type="checkbox"], [role="switch"]');
    if (target) {
      playMechanicalClick();
    }
  }, { passive: true });
}
