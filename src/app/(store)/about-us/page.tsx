'use client';
import { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function AboutUs() {
  const [readingQrCode, setReadingQrCode] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  const readQrCode = async () => {
    if (readingQrCode) return;
    codeReader.current = new BrowserMultiFormatReader();
    setReadingQrCode(true);

    try {
      const videoInputDevices =
        await codeReader.current.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        alert('Nenhuma câmera encontrada');
        setReadingQrCode(false);
        return;
      }
      const firstDeviceId = videoInputDevices[0].deviceId;
      codeReader.current.decodeFromVideoDevice(
        firstDeviceId,
        videoRef.current,
        (result) => {
          if (result) {
            setReadingQrCode(false);
            stopScanner();
          }
        },
      );
    } catch {
      setReadingQrCode(false);
    }
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setReadingQrCode(false);
    }
  };
  return (
    <div className="flex flex-col mt-10 w-full h-full">
      <h1 className="text-xl text-cake-happy-dark pb-5">Sobre Nós</h1>
      <p className="text-justify">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
        animi laudantium! Quidem explicabo fuga veritatis quia! Nulla eveniet,
        fugit vero, quibusdam architecto natus odio quidem praesentium, nam
        suscipit accusantium ut.
      </p>
      <button
        onClick={readQrCode}
        className="bg-cake-happy-dark text-white px-2 py-1"
      >
        Ler qr code
      </button>
      {readingQrCode && (
        <div
          className={`fixed z-50 inset-0 w-full flex justify-center items-center bg-black/55`}
        >
          <video
            ref={videoRef}
            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-lg object-cover"
            muted
            playsInline
            autoPlay
          ></video>
        </div>
      )}
    </div>
  );
}
