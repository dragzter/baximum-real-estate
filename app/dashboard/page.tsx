"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageNav from "@/components/page-nav";
import { Bot, Check, Copy } from "lucide-react";
import axios from "axios";
import { useState } from "react";

type Chat = {
  q: string;
  a: string;
};

export default function Dashboard() {
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [copied, setCopied] = useState(false);

  const askAi = async (text: string) => {
    try {
      const resp = await axios.post("/api/ai", { data: text });
      const newChat: Chat = {
        q: text,
        a: resp.data.result, // Make sure you match your API response
      };

      setText("");

      setChats((prevChats) => [newChat, ...prevChats]);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <PageNav />

      <div className="flex">
        <div
          id="main-dashboard"
          className="w-1/4 p-6 border-r flex flex-col h-[calc(100vh-84px)] min-w-[400px]"
        >
          <div className="flex flex-col h-full w-full gap-2 ">
            <div
              id="ai-response-container"
              className="flex flex-col-reverse overflow-y-auto flex-1 gap-2 mb-2"
            >
              {chats.map((chat, index) => (
                <div key={index}>
                  {/* User's Question */}
                  <div className="p-3 rounded-md bg-muted border user-chat mb-2">
                    <p className="text-sm text-muted-foreground font-semibold">
                      You:
                    </p>
                    <p className="text-base">{chat.q}</p>
                  </div>

                  <div className="relative group p-3 rounded-md bg-[#fbfbfb] border border-purple-100 ai-chat mb-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(chat.a);
                        setCopied(true); // ✅ Set copied true when clicked
                        setTimeout(() => setCopied(false), 1500); // ✅ Reset after 1.5 seconds
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
             text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 py-1 text-muted-foreground" />
                      )}
                    </button>

                    <p className="text-sm font-semibold text-cyan-500">AI:</p>
                    <p className="text-base">{chat.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="bg-purple-50 text-teal-700 px-4 py-2 rounded-md border">
              Asking questions about the 55 unit deal
            </p>
            <Textarea
              placeholder="Type your message here."
              className="h-24"
              value={text}
              onChange={(e) => setText(e?.target?.value || "")}
            />
            <Button
              onClick={() => askAi(text)}
              className="h-12 px-5 text-lg flex items-center gap-2"
            >
              <Bot className="h-5 w-5" />
              Ask Question
            </Button>
          </div>
        </div>

        <div
          id={"deals-dashboard"}
          className="w-3/4 p-6 bg-background overflow-y-auto min-w-[350px]"
        >
          <h2 className="mb-5 text-3xl font-bold">My Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={"text-2xl"}>55 Unit</CardTitle>
              </CardHeader>
              <CardContent>Investor 1, Investor 2</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={"text-2xl"}>64 Units</CardTitle>
              </CardHeader>
              <CardContent>Some content for card 2.</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={"text-2xl"}>24 Unit</CardTitle>
              </CardHeader>
              <CardContent>Some content for card 3.</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
