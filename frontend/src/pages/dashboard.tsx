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

  const handleInputChange = (e:any) => {
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
    formDataToSend.append("file", "");
    toast("Event has been created.");

    try {
      toast.promise(
        axios.post("http://127.0.0.1:3001/upload", formDataToSend, {
          headers: { authorization: "token_01HPT3DCKNSKFHWFJSWEEK296F" },
        }),
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
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px] bg-brand-400 text-white">
        <CardHeader>
          <CardTitle>Upload a PDF</CardTitle>
          <CardDescription className="text-white">
            Get advanced level data with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 text-white">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name of your project"
                  className="text-white border-white focus:border-white"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="report" className="text-white">
                  Report
                </Label>
                <Input
                  type="file"
                  id="report"
                  placeholder="Upload file"
                  className="text-white"
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
          <Button variant="outline" className="text-black">
            Cancel
          </Button>
          <Button onClick={handleDeploy}>Upload</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
