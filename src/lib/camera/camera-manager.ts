export interface CameraConfig {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

export class CameraManager {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private isRunning = false;

  public async start(
    videoElement: HTMLVideoElement,
    config: CameraConfig = { width: 1280, height: 720, facingMode: 'user' }
  ): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera access is not supported in this browser.');
    }

    // Stop any existing stream
    this.stop();

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: config.facingMode || 'user',
          width: { ideal: config.width || 1280 },
          height: { ideal: config.height || 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.stream = stream;
      this.videoElement = videoElement;

      videoElement.srcObject = stream;
      videoElement.playsInline = true;
      videoElement.muted = true;

      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement
            .play()
            .then(() => {
              this.isRunning = true;
              resolve();
            })
            .catch(reject);
        };
        videoElement.onerror = (err) => reject(err);
      });

      return true;
    } catch (error: unknown) {
      this.stop();
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          throw new Error('Camera permission was denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          throw new Error('No camera found on this device.');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          throw new Error('Camera is already in use by another application.');
        }
      }
      throw error;
    }
  }

  public stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }

    this.isRunning = false;
  }

  public isActive(): boolean {
    return this.isRunning && this.stream !== null && this.stream.active;
  }
}
