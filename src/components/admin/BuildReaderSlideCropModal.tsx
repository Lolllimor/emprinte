'use client';

import 'react-easy-crop/react-easy-crop.css';

import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

import { BUILD_READER_SLIDE_ASPECT } from '@/lib/build-reader-slide-crop';
import { getCroppedHeroJpegFile } from '@/lib/article-hero-crop';

type BuildReaderSlideCropModalProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropped: (file: File) => boolean | Promise<boolean>;
};

export function BuildReaderSlideCropModal({
  open,
  imageSrc,
  onClose,
  onCropped,
}: BuildReaderSlideCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_c: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const file = await getCroppedHeroJpegFile(imageSrc, croppedAreaPixels, 'build-a-reader-slide.jpg');
      const ok = await onCropped(file);
      if (!ok) return;
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not crop image.');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setError(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    onClose();
  };

  if (!open || !imageSrc) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-200 flex flex-col bg-black/55 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="build-reader-slide-crop-title"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-[#142218]/10 px-4 py-3 sm:px-5">
          <h2
            id="build-reader-slide-crop-title"
            className="font-lora text-lg font-semibold text-[#142218] sm:text-xl"
          >
            Crop slideshow image
          </h2>
          <p className="mt-1 font-poppins text-xs leading-relaxed text-[#5a6570] sm:text-sm">
            Drag and zoom to choose what visitors see on the homepage. This frame matches the
            Build a Reader image area. Then we upload your crop to Cloudinary.
          </p>
        </div>

        <div className="relative min-h-[220px] flex-1 bg-[#1a1a1a] sm:min-h-[280px] md:min-h-[320px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={BUILD_READER_SLIDE_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={false}
            showGrid={false}
          />
        </div>

        <div className="space-y-3 border-t border-[#142218]/10 px-4 py-4 sm:px-5">
          <label className="flex flex-col gap-2">
            <span className="font-poppins text-xs font-semibold text-[#142218]">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#005D51]"
            />
          </label>
          {error ? (
            <p className="font-poppins text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border-2 border-[#142218]/15 bg-white px-4 font-poppins text-sm font-semibold text-[#142218] transition hover:bg-[#142218]/05 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleApply()}
              disabled={busy || !croppedAreaPixels}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#005D51] px-5 font-poppins text-sm font-semibold text-white transition hover:bg-[#004438] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Applying…' : 'Use crop & upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
