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
	sale_price?: string;
	gross_profit?: string;
	number_units_stabilized?: number;
	number_units_unstabilized?: number;
	sale_or_refinance_date?: string;
	refinance_valuation?: string;
	estimated_value?: string;
	investors?: Investor[];
};

export type DealPatch = Partial<Deal>; // Used for PATCH request when we only want to update a
// partial of the Deal type

export type Investor = {
	name: string;
	email: string;
	phone: string;
};

export interface BaxUser {
	sid?: string;
	sub: string;
	name: string;
	nickname: string;
	picture: string;
	email: string;
	id: string;
	isAdmin: boolean;
	createdAt?: string;
	properties: string[];
}

// Response Types
export interface ApiResponse<T> {
	error?: string | Error;
	message?: string;
	data?: T;
	success: boolean;
}
