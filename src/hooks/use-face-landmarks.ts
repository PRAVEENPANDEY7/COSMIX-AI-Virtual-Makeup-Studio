import { useCallback } from 'react';
import { useStudioStore } from '@/stores/studio-store';
import { detectFaceInImage } from '@/lib/vision/face-landmarker';
import { extractLipContours } from '@/lib/vision/landmarks';

export function useFaceLandmarks() {
  const {
    setLandmarks,
    setFaceError,
    setProcessingStatus,
  } = useStudioStore();

  const processImageForFace = useCallback(
    async (imageElement: HTMLImageElement, width: number, height: number) => {
      try {
        setProcessingStatus({
          stage: 'initializing-ai',
          message: 'Loading Face Mesh AI model...',
        });

        setProcessingStatus({
          stage: 'detecting-face',
          message: 'Detecting facial contours...',
        });

        const detectionResult = await detectFaceInImage(imageElement);

        if (
          !detectionResult ||
          !detectionResult.faceLandmarks ||
          detectionResult.faceLandmarks.length === 0
        ) {
          setFaceError('No face detected in this photograph. Please upload a clear frontal portrait with good lighting.');
          setProcessingStatus({
            stage: 'error',
            message: 'No face detected.',
          });
          setLandmarks(null, null);
          return null;
        }

        const primaryLandmarks = detectionResult.faceLandmarks[0];

        setProcessingStatus({
          stage: 'identifying-lips',
          message: 'Extracting lip geometry & mouth cavity...',
        });

        const contours = extractLipContours(primaryLandmarks, width, height);

        setLandmarks(primaryLandmarks, contours);

        setProcessingStatus({
          stage: 'ready',
          message: 'Face & lips detected successfully.',
        });

        return { landmarks: primaryLandmarks, contours };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error processing face landmarks.';
        setFaceError(message);
        setProcessingStatus({
          stage: 'error',
          message,
        });
        return null;
      }
    },
    [setLandmarks, setFaceError, setProcessingStatus]
  );

  return { processImageForFace };
}
