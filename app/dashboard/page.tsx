"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageNav from "@/components/page-nav";
import { Bot, Check, Copy } from "lucide-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BarChartComponent } from "@/components/bar-chart";
import { LineChart } from "@/components/line-chart";
import { PieChartComponent } from "@/components/pie-chart";
import { SheetDrawer } from "@/components/sheet-drawer";

type Chat = {
  q: string;
  a: string;
};

type Deal = {
  id: string;
  title: string;
  description: string;
  investors?: string[];
};

export default function Dashboard() {
  const [text, setText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");

  const deals: Deal[] = useMemo(
    () => [
      {
        title: "55 Unit",
        id: "55-unit",
        description: "Property in Concord NH",
        investors: ["Sam Weissman", "Maggie Oleg", "Terry Baker"],
      },
      {
        title: "64 Units",
        id: "64-unit",
        description: "64 unit complex in Rochester",
        investors: ["Sam Weissman", "Donald Pellham"],
      },
      {
        title: "24 Unit",
        id: "24-unit",
        description: "3 8 unit multi-family buildings",
        investors: ["Todd Brussels", "Bobby Stevenson", "Aaron Berkshire"],
      },
      {
        title: "55 Unit",
        id: "55-unit-2",
        description: "Property in Concord NH",
        investors: ["Sam Weissman", "Maggie Oleg", "Terry Baker"],
      },
      {
        title: "64 Units",
        id: "64-unit-2",
        description: "64 unit complex in Rochester",
        investors: ["Sam Weissman", "Donald Pellham"],
      },
      {
        title: "24 Unit",
        id: "24-unit-2",
        description: "3 8 unit multi-family buildings",
        investors: ["Todd Brussels", "Bobby Stevenson", "Aaron Berkshire"],
      },
      {
        title: "55 Unit",
        id: "55-unit-3",
        description: "Property in Concord NH",
        investors: ["Sam Weissman", "Maggie Oleg", "Terry Baker"],
      },
    ],
    [],
  );

  const selectedProperty = useMemo(() => {
    return deals.find((deal) => deal.id === selectedPropertyId);
  }, [selectedPropertyId, deals]);

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
          <div className="mb-8 flex items-center justify-start gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Selected Property
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                {selectedProperty?.title || "No Selection"}
              </h2>

              {selectedProperty?.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.description}
                </p>
              )}
            </div>

            <SheetDrawer buttonText={"Select Property"}>
              {deals.map((deal) => (
                <Card
                  key={deal.id}
                  onClick={() => setSelectedPropertyId(deal.id)}
                  className="group cursor-pointer rounded-lg border border-muted bg-background p-3 shadow-sm transition hover:border-primary hover:shadow-md min-w-[220px]"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-tight">
                      {deal.description}
                    </p>
                  </div>
                </Card>
              ))}
            </SheetDrawer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {selectedProperty && (
              <>
                <LineChart />
                <PieChartComponent />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
