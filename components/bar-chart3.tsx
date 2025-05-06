import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Deal } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
	data: Deal[];
};

function parseCurrency(value: string | undefined): number {
	return parseFloat((value || "").replace(/[^0-9.]/g, "")) || 0;
}

export function UnitsVsIncomeChart({ data }: Props) {
	const scatterData = data.map((deal) => ({
		x: deal.units,
		y: parseCurrency(deal.current_realized_income),
		name: deal.address.split(",")[0],
	}));

	const highestIncome = Math.max(
		...data.map((d) => {
			return parseFloat(d.current_realized_income.replace(/[^0-9.]/g, ""));
		})
	);

	console.log(data.map((d) => parseFloat(d.current_realized_income.toLocaleString())));
	const maxUnits = Math.max(...scatterData.map((d) => d.x)) + 4;
	const maxIncome = (highestIncome + highestIncome / 8).toFixed(2);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Units vs. Realized Income</CardTitle>
			</CardHeader>
			<CardContent className="h-[400px]">
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart margin={{ right: 30, bottom: 20, left: 40 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="x"
							type="number"
							domain={[0, maxUnits]}
							name="Units"
							label={{ value: "Units", position: "insideBottomRight", offset: -10 }}
						/>
						<YAxis
							dataKey="y"
							type="number"
							name="Income"
							domain={[0, maxIncome]}
							label={{
								value: "Income ($)",
								angle: -90,
								position: "insideLeft",
								offset: -12,
							}}
							tick={({ x, y, payload }) => (
								<text
									x={x - 10}
									y={y}
									transform={`rotate(-45, ${x - 10}, ${y})`}
									textAnchor="end"
									fill="#4B5563"
									fontSize={12}
								>
									{formatCurrency(payload.value)}
								</text>
							)}
						/>
						<Tooltip cursor={{ strokeDasharray: "3 3" }} />
						<Scatter name="Properties" data={scatterData} fill="#8884d8">
							{/*<LabelList dataKey="name" position="bottom" fontSize={8} />*/}
						</Scatter>
					</ScatterChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
