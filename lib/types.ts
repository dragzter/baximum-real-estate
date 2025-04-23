export type Deal = {
	id: string;
	address: string;
	purchase_date: string;
	purchase_price: string;
	down_payment_reserves: string;
	unstabilized_projected_income: string;
	current_realized_income: string;
	rent_increase_percent: string;
	units: number;
	major_capital_event: boolean;
	estimated_irr?: string;
	sale_value?: string;
	gross_profit?: string;
	sale_or_refinance_date?: string;
	refinance_valuation?: string;
	estimated_value?: string;
	investors?: Investor[];
};

export type Investor = {
	name: string;
	email: string;
	phone: string;
};
