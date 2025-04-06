"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- Your real investors + custom colors
const chartData = [
  { investor: "Harold Harrison ", investment: 100000, fill: "var(--chart-1)" },
  { investor: "Blake Everest ", investment: 75000, fill: "var(--chart-2)" },
  { investor: "Karl Dychler ", investment: 50000, fill: "var(--chart-3)" },
  { investor: "Steve Olsen ", investment: 25000, fill: "var(--chart-4)" },
  { investor: "John Brohns ", investment: 15000, fill: "var(--chart-5)" },
  { investor: "Pete Foster  ", investment: 35000, fill: "var(--chart-6)" },
];

// --- (Optional) Chart config if your ChartContainer/Tooltip ever needs it
const chartConfig = {
  investment: {
    label: "Investment",
  },
  harold: {
    label: "Harold Harrison",
    color: "hsl(var(--chart-1))",
  },
  blake: {
    label: "Blake Everest",
    color: "hsl(var(--chart-2))",
  },
  karl: {
    label: "Karl Dychler",
    color: "hsl(var(--chart-3))",
  },
  steve: {
    label: "Steve Olsen",
    color: "hsl(var(--chart-4))",
  },
  john: {
    label: "John Brohns",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PieChartComponent() {
  const totalInvestment = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.investment, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Investor Contributions</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="investment" // changed from "visitors" to "investment"
              nameKey="investor" // changed from "browser" to "investor"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ${totalInvestment.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Invested
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total contributions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
