"use client";

import Image from "next/image";
import NavLink from "./NavLink";

let heroImages = ["/1.png", "/6.png", "/3.png", "/4.png", "/5.png", "/2.png"];

export default function Hero() {
  return (
    <section>
      <div className="custom-screen pt-28 text-gray-600">
        <div className="mx-auto max-w-4xl space-y-5 text-center">
          {" "}
          <h1 className="mx-auto text-4xl font-extrabold text-gray-800 sm:text-6xl">
            Generate your next AI QR Code in seconds
          </h1>{" "}
          <p className="mx-auto max-w-xl">
            QRGPT makes it simple for you to generate cool looking AI QR codes
            in seconds, completely for free.
          </p>
          <div className="flex items-center justify-center gap-x-3 text-sm font-medium">
            {" "}
            <NavLink
              href="/start"
              className="bg-gray-800 text-white hover:bg-gray-600 active:bg-gray-900"
            >
              Generate your QR Code
            </NavLink>
            <NavLink
              target="_blank"
              href="https://github.com/Nutlope/qrGPT"
              className="border text-gray-700 hover:bg-gray-50"
              scroll={false}
            >
              Learn more
            </NavLink>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-10 sm:grid-cols-3">
            {heroImages.map((image, idx) => (
              <Image
                key={idx}
                alt="image"
                src={image}
                width={500}
                height={500}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
