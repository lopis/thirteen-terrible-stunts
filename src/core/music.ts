class MusicPlayer {
  audioContext: AudioContext | undefined;
  source: AudioBufferSourceNode | undefined;
  startTime = 0;
  isPlaying = false;
  buffer: AudioBuffer | undefined;

  async init() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    await this.audioContext.resume();
    await this.audioContext.audioWorklet.addModule("a.js");

    const musicProcessorNode = new AudioWorkletNode(this.audioContext, "music-processor");
    musicProcessorNode.port.onmessage = (event) => {
      if (event.data.type === 'done') {
        console.log('Finished processing entire song');
        // Take appropriate action when processing is complete
        this.startPlayback();
      }
    };
    // Connect the node to the audio context
    musicProcessorNode.connect(this.audioContext.destination);
  }

  startPlayback() {
    if(this.buffer) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(this.audioContext.destination);
      this.source.loop = true;
      this.isPlaying = true;
      this.source?.start();
    }
  }
}

export default new MusicPlayer();