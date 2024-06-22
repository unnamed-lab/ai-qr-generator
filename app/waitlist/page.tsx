import Image from "next/image";

export default function WaitlistPage() {
  return (
    <div className="mx-auto mt-20 text-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <Image src="/box.svg" alt="logo" width={200} height={200} />
        <div className="text-4xl font-bold">QrGPT</div>
      </div>

      <div className="prose mx-auto mt-36 text-center">
        <h1 className="text-3xl font-bold lg:text-5xl">
          Stop being sneaky and just wait for the launch.
        </h1>
        <h3 className="mt-5 text-lg font-normal text-gray-500 lg:text-xl">
          Thank you. It&apos;ll be out soon, I promise.
        </h3>
      </div>
    </div>
  );
}
