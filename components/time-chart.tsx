"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Tooltip, LabelList } from "recharts";
import { Deal } from "@/lib/types";

type Props = {
	properties: Deal[];
};

type TimelineData = {
	address: string;
	duration: number;
};

export function TimelineChart({ properties }: Props) {
	const chartData: TimelineData[] = properties
		.filter((p) => p.purchase_date && p.sale_or_refinance_date)
		.map((p) => {
			const purchase = new Date(p.purchase_date).getTime();
			const sale = new Date(p.sale_or_refinance_date!).getTime();
			const duration = Math.round((sale - purchase) / (1000 * 60 * 60 * 24));
			return {
				address: p.address,
				duration,
			};
		});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Capital Event Timelines (Days)</CardTitle>
			</CardHeader>
			<CardContent className="h-[500px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 40 }}>
						<XAxis
							type="number"
							domain={[90, "dataMax + 30"]}
							label={{
								value: "Days Until Capital Event",
								position: "insideBottomRight",
								offset: -10,
							}}
						/>
						<YAxis
							dataKey="address"
							type="category"
							width={170}
							tick={({ x, y, payload }) => (
								<g transform={`translate(${x},${y})`}>
									<text x={0} y={0} dy={4} textAnchor="end" transform="rotate(-25)" fontSize={12} fill="#4B5563">
										{payload.value}
									</text>
								</g>
							)}
						/>
						<Tooltip formatter={(value) => [`${value} days`, "Duration"]} labelFormatter={(label) => label} />
						<Bar dataKey="duration" fill="#6d2d91">
							<LabelList dataKey="duration" position="right" formatter={(val: number) => `${val}d`} />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
