import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="bg-white min-h-screen w-full">
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
            <h1 className="text-8xl font-extrabold text-[#023382]">
              Medofile - Cloud integrated AI : medical report analysis
            </h1>
            <p className="text-2xl font-normal text-[#3c84fb] pt-4 mb-4">
              Share you medical reports easily and securely, <br /> while also
              gaining insights and interacting with your report
            </p>
            <div className="flex flex-row">
            <Link href={"/register"}>
              <Button
                variant="outline"
                className="bg-[#023382] text-white hover:bg-[#3c84fb] hover:text-white w-28 h-10"
              >
                Register
              </Button>
              </Link>
              <Link href={"/login"} className="ml-12">
              <Button
                variant="outline"
                className="bg-[#023382] text-white hover:bg-[#3c84fb] hover:text-white w-28 h-10"
              >
                Login
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen text-center mt-36">
        <div className="">
          <div className="text-[#023382] text-6xl font-bold">Made by</div>
          <div className="flex gap-24 justify-evenly mt-36">
            <div>
              <Image
                src="/pic_1.jpg"
                alt="Description"
                className=""
                width={350}
                height={350}
              />
              <p className="text-[#3c84fb] text-xl font-semibold mt-4">PRIYAN R K - RA2111003010568</p>
            </div>
            <div>
              <Image
                src="/pic_22.jpg"
                alt="Description"
                className=""
                width={350}
                height={350}
              />
              <p className="text-[#3c84fb] text-xl font-semibold mt-4">ANISH MOHAN R R - RA2111003010566</p>
            </div>
          </div>
          <div className="text-[#023382] text-6xl font-bold mt-36">Under the guidance of</div>
          <div className="flex gap-24 justify-evenly mt-36">
           
            <div>
              <Image
                src="/pic_3.jpg"
                alt="Description"
                className=""
                width={350}
                height={350}
              />
              <p className="text-[#3c84fb] text-xl font-semibold mt-4 mb-12">Dr.AKILANDESWARI <br /> Department of Computing Technologies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
