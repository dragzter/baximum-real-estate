"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Deal } from "@/lib/types";
import { parseCurrency } from "@/lib/utils"; // assume this parses "$83,220" to 83220

type Props = {
	properties: Deal[];
};

export default function PurchaseVsSaleChart({ properties }: Props) {
	const data = properties
		.filter((p) => p.purchase_price && p.sale_price)
		.map((p) => ({
			address: p.address,
			purchase: parseCurrency(p.purchase_price),
			sale: parseCurrency(p.sale_price),
		}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Value at Purchase vs Value at Refinance</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={500}>
					<BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
						<XAxis dataKey="address" interval={0} angle={-5} textAnchor="end" tick={{ fontSize: 12 }} />
						<YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
						<Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
						<Legend verticalAlign="bottom" wrapperStyle={{ bottom: 0 }} />
						<Bar dataKey="purchase" fill="#60a5fa" name="Value at Purchase" />
						<Bar dataKey="sale" fill="#34d399" name="Value at Refinance" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
