import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Deal } from "@/lib/types";

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
	const maxIncome = highestIncome + highestIncome / 8;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Units vs. Realized Income</CardTitle>
			</CardHeader>
			<CardContent className="h-[400px]">
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart margin={{ right: 30, bottom: 20, left: 20 }}>
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
							label={{ value: "Income ($)", angle: -90, position: "insideLeft", offset: -13 }}
						/>
						<Tooltip cursor={{ strokeDasharray: "3 3" }} />
						<Scatter name="Properties" data={scatterData} fill="#8884d8">
							<LabelList dataKey="name" position="bottom" />
						</Scatter>
					</ScatterChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
