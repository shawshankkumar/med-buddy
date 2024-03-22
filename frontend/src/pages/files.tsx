import axios from "axios";
import { use, useEffect, useState } from "react";



export default function Chat() {
  const [id, setId] = useState<string>("");
  const [chat, setChat] = useState<any>([]);
  const [userData, setUserData] = useState<any>([]);


 
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
     
    </div>
  );
}
