import { useQRCode } from 'next-qrcode';

interface QRCodeProps {
  text: string;
  size?: number;
}

export function QRCode({ text, size = 128 }: QRCodeProps) {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={text}
      options={{
        level: 'M',
        margin: 3,
        scale: 4,
        width: size,
      }}
    />
  );
}
