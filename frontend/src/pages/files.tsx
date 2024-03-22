import axios from "axios";
import { use, useEffect, useState } from "react";
import { BellRing, Check, Inspect, Share } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function formatTimestamp(epochTimestamp: number) {
  // Convert epoch timestamp to milliseconds
  const timestampInMillis = epochTimestamp * 1000;

  // Get the date object corresponding to the timestamp
  const dateObject = new Date(timestampInMillis);

  // Extract hours, minutes, and date from the date object
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const month = dateObject.toLocaleString("default", { month: "long" });
  const day = dateObject.getDate();

  // Convert hours to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // Format minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the human-readable format
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}, on ${day} ${month}`;

  return formattedTime;
}

const notifications = [
  {
    title: "Your chat",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

export default function Chat() {
  const [files, setFIles] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);

  useEffect(() => {
    async function getChats() {
      setUserData(JSON.parse(window.localStorage.getItem("userData") ?? "{}"));
      try {
        const { data } = await axios.post(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/files",
          {},
          {
            headers: {
              Authorization: JSON.parse(
                window.localStorage.getItem("userData") ?? "{}"
              ).token,
            },
          }
        );
        console.log(data.data);
        setFIles(data.data);
      } catch (err) {
        setFIles([]);
      }
    }
    getChats();
  }, []);
  return (
    <div className=" min-h-screen my-36 mx-8 ">
      <span className="flex justify-center text-6xl text-[#023382] font-bold mb-12">
        Your Files
      </span>
      <div className="grid grid-cols-3 gap-24 ml-24">
        {files.map((file: any) => {
          return (
            <Card
              className={cn("w-[380px] shadow-2xl")}
              key={JSON.stringify(file)}
            >
              <CardHeader>
                <CardTitle>{file.reportName}</CardTitle>
                <CardDescription>
                  {formatTimestamp(file.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className=" flex items-center space-x-4 rounded-md border p-4">
                  <BellRing />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Publish to Public
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Caution: Anyone with link will be able to see your report
                      and chat
                    </p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <div
                    key={"1"}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Your report is shared with{" "}
                        <span className="text-sm text-muted-foreground">
                          {file.sharedWith.length} other person(s)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    key={"2"}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Your summary has
                        <span className="text-sm text-muted-foreground">
                          {file.summary ? " been generated " : ' not been generated '}
                        </span>
                        click see insights to {file.summary ? " view " : ' generate'}
                      </p>
                    </div>
                  </div>
                </div>              </CardContent>
              <CardFooter className="grid grid-rows-2 gap-6">
                <Button className="w-full bg-[#023382]/40 hover:bg-[#023382]/40" disabled={file.shared}>
                  <Share className="mr-2 h-4 w-4" /> Share Now
                </Button>
                <Button className="w-full bg-[#023382]">
                  <Inspect className="mr-2 h-4 w-4" /> See Insights
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
