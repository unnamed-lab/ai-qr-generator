import Image from "next/image";

type QrCardProps = {
  imageURL?: string;
  time: string;
};

export const QrCard: React.FC<QrCardProps> = ({ imageURL, time }) => {
  if (!imageURL) {
    return (
      <div>
        <p>Image URL not provided</p>
      </div>
    );
  }

  return (
    <div className="group relative mx-auto flex w-[510px] max-w-full flex-col items-center justify-center gap-y-2 rounded border border-gray-300 p-2 shadow">
      <Image
        src={imageURL}
        className="rounded"
        alt="qr code"
        width={480}
        height={480}
      />
      <p className="text-sm italic text-gray-400">
        QR code took {time} seconds to generate.
      </p>
    </div>
  );
};
