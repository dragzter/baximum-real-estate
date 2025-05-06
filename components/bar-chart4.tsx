"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Deal } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
	data: Deal[];
};

export function RentIncreaseChart({ data }: Props) {
	const chartData = data.map((property) => ({
		address: property.address,
		increase: parseFloat(property.rent_increase_percent.replace("%", "")),
	}));

	const maxIncrease = Math.max(...chartData.map((d) => d.increase));

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Rent Increase Percent by Property</CardTitle>
			</CardHeader>
			<CardContent className="h-[500px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 50, left: 0, bottom: 20 }}>
						<XAxis type="number" domain={[0, Math.ceil(maxIncrease + 10)]} tickFormatter={(val) => `${val}%`} />
						<YAxis
							dataKey="address"
							type="category"
							width={80}
							tick={({ x, y, payload }) => {
								const words = payload.value.split(" ");
								const lines = [];
								let currentLine = "";

								words.forEach((word) => {
									if ((currentLine + " " + word).length > 20) {
										lines.push(currentLine);
										currentLine = word;
									} else {
										currentLine += (currentLine ? " " : "") + word;
									}
								});
								if (currentLine) lines.push(currentLine);

								return (
									<text
										x={x}
										y={y - 18}
										transform={`rotate(-70, ${x}, ${y})`}
										fontSize={13}
										textAnchor="end"
										fill="#4B5563"
										dy={3}
									>
										{lines.map((line, index) => (
											<tspan key={index} x={x} dy={index === 0 ? 0 : 12}>
												{line}
											</tspan>
										))}
									</text>
								);
							}}
						/>
						<Tooltip formatter={(value: number) => `${value}%`} />
						<Bar dataKey="increase" fill="#8884d8">
							<LabelList dataKey="increase" position="right" formatter={(val) => `${val}%`} />
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
