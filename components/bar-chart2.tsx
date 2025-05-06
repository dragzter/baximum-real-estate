"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Deal } from "@/lib/types";

type IRRChartProps = {
	properties: Deal[];
};

function parseIRR(irr: string) {
	return parseFloat(irr.replace("%", "").trim()) || 0;
}

export function IRRBarChart({ properties }: IRRChartProps) {
	const data = properties.map((deal) => ({
		name: deal.address.split(",")[0],
		irr: parseIRR(deal.estimated_irr || "0"),
	}));

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Estimated IRR by Property</CardTitle>
			</CardHeader>
			<CardContent className="h-[400px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" fontSize={12} height={60} />
						<YAxis />
						<Tooltip formatter={(value) => `${value}%`} />
						<Bar dataKey="irr" fill="currentColor" className="text-primary" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
