"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageNav from "@/components/page-nav";
import { Bot } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <PageNav />

      <div className="flex">
        <div
          id="main-dashboard"
          className="w-1/4 p-6 border-r flex flex-col h-[calc(100vh-84px)] min-w-[400px]"
        >
          <div className="flex flex-col h-full w-full gap-2">
            <div
              id="ai-response-container"
              className="flex flex-col-reverse overflow-y-auto flex-1 gap-4 pr-2"
            >
              <div className="p-3 rounded-md bg-muted">
                <p className="text-sm text-muted-foreground font-semibold">
                  You:
                </p>
                <p className="text-base">Which deal is the most profitable</p>
              </div>

              <div className="p-3 rounded-md bg-accent">
                <p className="text-sm text-muted-foreground font-semibold">
                  AI:
                </p>
                <p className="text-base">
                  So far the most profitable deal is the 24 unit deal.
                </p>
              </div>
            </div>

            <Textarea placeholder="Type your message here." className="h-24" />
            <Button
              onClick={() => console.log("have clicked it")}
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
