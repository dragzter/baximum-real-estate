"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import { Deal } from "@/lib/types";

type Props = {
	properties: Deal[];
};

type TimelineData = {
	address: string;
	purchase: number;
	sale: number;
	duration: number;
};

export function TimelineChart({ properties }: Props) {
	const data: TimelineData[] = properties
		.filter((p) => p.purchase_date && p.sale_or_refinance_date)
		.map((p) => {
			const purchase = new Date(p.purchase_date).getTime();
			const sale = new Date(p.sale_or_refinance_date!).getTime();
			return {
				address: p.address,
				purchase,
				sale,
				duration: sale - purchase,
			};
		});

	const minDate = Math.min(...data.map((d) => d.purchase));
	const chartData = data.map((d) => ({
		...d,
		startOffset: d.purchase - minDate,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Capital Event Timelines</CardTitle>
			</CardHeader>
			<CardContent className="h-[500px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 40 }}>
						<XAxis
							type="number"
							domain={["dataMin", "dataMax"]}
							tickFormatter={(tick) => new Date(minDate + tick).toLocaleDateString()}
						/>
						<YAxis
							dataKey="address"
							type="category"
							width={170}
							tick={({ x, y, payload }) => {
								return (
									<g transform={`translate(${x},${y})`}>
										<text x={0} y={0} dy={4} textAnchor="end" transform="rotate(-25)" fontSize={12} fill="#4B5563">
											{payload.value}
										</text>
									</g>
								);
							}}
						/>
						<Tooltip
							formatter={(value, name) => {
								if (name === "duration") {
									const days = Math.round((value as number) / (1000 * 60 * 60 * 24));
									return [`${days} days`, "Duration"];
								}
								return value;
							}}
							labelFormatter={(label) => label}
						/>
						<Bar dataKey="duration" fill="#c084fc">
							<LabelList
								dataKey="duration"
								position="right"
								formatter={(val: number) => `${Math.round(val / (1000 * 60 * 60 * 24))}d`}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
