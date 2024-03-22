import React, { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

export default function CardWithForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    report: "",
  });
  const [fileName, setFiles] = React.useState<File | null>(null);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const inputRef = React.useRef();

  const handleDeploy = async () => {
    console.log("Form Data:", formData, fileName);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("file", fileName as File);
    console.log("Form Data:", formDataToSend);
    try {
      toast.promise(
        axios.post(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/upload",
          formDataToSend,
          {
            headers: {
              Authorization: JSON.parse(
                window.localStorage.getItem("userData") ?? "{}"
              ).token,
            },
          }
        ),
        {
          loading: "Loading...",
          success: (data) => {
            return `Uploded successfully.`;
          },
          error: "Error",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-screen min-h-screen text-[#023382] pt-36">
      <Card className="w-1/2 bg-brand-400 m-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-[#023382]">
            Upload a PDF
          </CardTitle>
          <CardDescription className="">
            Get advanced level data with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 mt-6">
                <Label htmlFor="name" className="text-[#023382] text-xl">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Name of your project"
                  className="mt-4"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5 mt-6">
                <Label htmlFor="report" className="text-[#023382] text-xl">
                  Report
                </Label>
                <Input
                  type="file"
                  id="report"
                  placeholder="Upload file"
                  className=""
                  accept=".pdf"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">   
          <Button onClick={handleDeploy} className="bg-[#023382]">
            Upload
          </Button>
          <Button
            variant="outline"
            className="px-6 bg-[#023382] text-white hover:bg-black hover:text-white"
            onClick={() => {
              window.location.href = "/files";
            }}
          >
            View Files
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
