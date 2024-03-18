import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Component() {
  return (
    <div className="bg-[#F6FDC3] min-h-screen w-full">
      <div className="flex items-center justify-ends">
        <div className="absolute top-0 right-0 w-1/3 h-screen">
          <Image
            src="/doctor.jpg"
            alt="Description"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>
        <div className="w-2/3 px-8 h-screen flex justify-center items-center">
          <div className="flex flex-col">
            <h1 className="text-8xl font-extrabold text-[#FF8080]">
              Medical Buddy
            </h1>
            <p className="text-2xl font-normal text-[#7743DB] pt-4 mb-4">
              Share you medical reports easily and securely, <br /> while also
              gaining insights and chatting with your report
            </p>
            <div className="flex flex-row">
              <Button
                variant="outline"
                className="bg-[#FF8080] text-white hover:bg-[#7743DB] hover:text-white w-28 h-10 mr-6"
              >
                Register
              </Button>
              <Button
                variant="outline"
                className="bg-[#FF8080] text-white hover:bg-[#7743DB] hover:text-white w-28 h-10"
              >
                Login In
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen flex items-center justify-center">
        <div className="text-[#FF8080] text-6xl font-bold">
          Made by
        </div>
        <div className="flex flex-col">
        <Image
            src="/doctor.jpg"
            alt="Description"
            className=""
            width={100}
            height={100}
          />
            <Image
            src="/doctor.jpg"
            alt="Description"
            className=""
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
