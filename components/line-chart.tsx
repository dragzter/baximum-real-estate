'use client';

import { TrendingUp } from 'lucide-react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils'; // <-- you already have this

const chartData = [
	{ month: 'January', rent: 23000, occupancy: 23 },
	{ month: 'February', rent: 21000, occupancy: 22 },
	{ month: 'March', rent: 28000, occupancy: 28 },
	{ month: 'April', rent: 28000, occupancy: 28 },
	{ month: 'May', rent: 32000, occupancy: 32 },
	{ month: 'June', rent: 34000, occupancy: 34 },
	{ month: 'July', rent: 34000, occupancy: 34 },
	{ month: 'August', rent: 35000, occupancy: 35 },
	{ month: 'September', rent: 38000, occupancy: 38 },
	{ month: 'October', rent: 37000, occupancy: 37 },
	{ month: 'November', rent: 42000, occupancy: 42 },
	{ month: 'December', rent: 42000, occupancy: 42 },
];

export function LineChart({
	title = '55 Unit Deal',
	subtitle = 'Rental Income by Month',
	data = chartData,
}: {
	title: string;
	subtitle: string;
	data?: typeof chartData;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{subtitle}</CardDescription>
			</CardHeader>

			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<BarChart
						data={data}
						layout="vertical"
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" horizontal={false} />
						<YAxis
							dataKey="month"
							type="category"
							tickLine={false}
							axisLine={false}
							width={80}
						/>
						<XAxis type="number" />
						<Tooltip
							formatter={(value: number, name: string) => {
								if (name === 'rent') {
									return formatCurrency(value);
								}
								return value;
							}}
						/>
						<Bar
							dataKey="rent"
							fill="hsl(var(--chart-1))"
							name="Rental Income"
							radius={[4, 4, 0, 0]}
							barSize={24}
						>
							<LabelList
								dataKey="rent"
								position="insideRight"
								offset={8}
								formatter={(value: string) => formatCurrency(parseFloat(value))}
								className="fill-white text-xs"
							/>
						</Bar>

						{/*<Bar*/}
						{/*  dataKey="occupancy"*/}
						{/*  fill="hsl(var(--chart-2))"*/}
						{/*  name="Occupancy"*/}
						{/*  radius={[4, 4, 0, 0]}*/}
						{/*  barSize={20}*/}
						{/*>*/}
						{/*  <LabelList*/}
						{/*    dataKey="occupancy"*/}
						{/*    position="right"*/}
						{/*    offset={8}*/}
						{/*    className="fill-foreground text-xs"*/}
						{/*  />*/}
						{/*</Bar>*/}
					</BarChart>
				</ResponsiveContainer>
			</CardContent>

			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing rental income and occupancy over the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}
