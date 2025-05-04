import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	});
}

export const DATA_KEYS = {
	address: 'Address',
	units: 'Units',
	purchase_date: 'Purchase Date',
	purchase_price: 'Purchase Price',
	down_payment_reserves: 'Downpayment, Closing & Reserves',
	unstabilized_projected_income: 'Unstabilized Scheduled Income',
	current_realized_income: 'Current or Realized Income',
	rent_increase_percent: '% Increased in Rent',
	estimated_value: 'Total Estimated Value',
	refinance_valuation: 'Refinance Valuation',
	sale_price: 'Sale Price',
	gross_profit: 'Gross Profit or Gross Appreciation',
	sale_or_refinance_date: 'Sale or Refinance Date',
	major_capital_event: 'Major Capital Event Already Executed',
	estimated_irr: 'Estimated IRR (Not Including Distributions)',
};

export const VIEWS = {
	dashboard: 'dashboard',
	property_list: 'property_list',
	add_property: 'add_property',
};

export const ADMIN_LIST = process.env.NEXT_PUBLIC_ADMIN_LIST?.split(',');
