import { Button } from "@/components/ui/button";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { set } from "react-hook-form";
import { toast } from "sonner";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroup,
} from "@radix-ui/react-dropdown-menu";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [chat, setChat] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState<string>("Ask Med Buddy");
  const [position, setPosition] = useState("English");

  async function sendMessage() {
    console.log(message);
    toast.info("Generating response, please wait", {
      position: "bottom-left",
    });
    setLoading("Generating...");
    setChat([
      ...chat,
      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ]);
    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/chat",
        {
          fileName: id,
          message,
          lang: position,
        },
        {
          headers: {
            Authorization: JSON.parse(
              window.localStorage.getItem("userData") ?? "{}"
            ).token,
          },
        }
      );
      console.log(data);
      data.data.shift();
      setChat(data.data);
      setMessage("");
      toast.success("Response generated successfully", {
        position: "bottom-left",
      });
      setLoading("Ask Med Buddy");
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  }
  useEffect(() => {
    async function getChats() {
      const searchParams = new URLSearchParams(window.location.search);
      const idParam = searchParams.get("id");
      setUserData(JSON.parse(window.localStorage.getItem("userData") ?? "{}"));
      setId(idParam || "");
      try {
        const { data } = await axios.post(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/chat-all",
          { fileName: idParam },
          {
            headers: {
              Authorization: JSON.parse(
                window.localStorage.getItem("userData") ?? "{}"
              ).token,
            },
          }
        );
        data.data.shift();
        console.log(data.data);
        setChat(data.data);
      } catch (err) {
        setChat([]);
      }
    }
    getChats();
  }, []);
  return (
    <div className="w-screen my-12">
      <div className="w-2/3 m-auto">
        <div className="flex justify-between my-12">
          <p className="text-[#023382] font-bold text-xl">
            Welcome to Med Buddy, {userData?.user?.name}
          </p>
          <Button className="bg-[#023382]">Logout</Button>
        </div>
        {chat.map((e: any, i: number) => {
          return (
            <div
              key={JSON.stringify(e) + String(i)}
              className="flex justify-between"
            >
              <div
                className={`min-w-[30%] max-w-[85%] rounded-xl ${
                  e.role === "user"
                    ? " bg-[#023382] text-white ml-auto rounded-br-none"
                    : "bg-[#023382]/15 text-black mr-auto rounded-bl-none"
                } p-4 text-sm text-black mt-6`}
              >
                {e.parts[0].text.replace(/\*\*/g, "").replace(/\*/g, "")
                  .length > 0
                  ? e.parts[0].text.replace(/\*\*/g, "").replace(/\*/g, "")
                  : "Censored text"}
              </div>
            </div>
          );
        })}
        <div className="flex w-full  items-center space-x-2 mt-8">
          <Input
            type="email"
            placeholder="Email"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#023382] text-white w-24 hover:bg-black hover:text-white">{position}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Language Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  {["English", "Bengali", "Hindi", "Tamil", "Marathi"].map((e) => {
                    return <DropdownMenuRadioItem value={e}>{e}</DropdownMenuRadioItem>
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button type="submit" onClick={sendMessage} className="bg-[#023382]">
            {loading}
          </Button>
        </div>
      </div>
    </div>
  );
}
