export type MicState = "idle" | "recording";

export class MicRecorder {
  private chunks: BlobPart[] = [];
  private rec?: MediaRecorder;
  state: MicState = "idle";

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus" : "audio/webm";
    this.chunks = [];
    this.rec = new MediaRecorder(stream, { mimeType: mime });
    this.rec.ondataavailable = e => e.data && this.chunks.push(e.data);
    this.rec.start();
    this.state = "recording";
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.rec) return resolve(new Blob());
      const stream = this.rec.stream;
      this.rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        this.state = "idle";
        resolve(new Blob(this.chunks, { type: this.rec!.mimeType }));
      };
      this.rec.stop();
    });
  }
}

