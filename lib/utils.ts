import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

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

export function formatCurrencyOnChange(key, value: string, form) {
	const raw = value.replace(/[^0-9.]/g, '');
	const parsed = parseFloat(raw);

	const formatted = isNaN(parsed) ? '' : `$${parsed.toLocaleString()}`;

	form.setValue(key, formatted);
}

export function parseCurrency(value: string | number): number {
	if (typeof value === 'number') return value;
	const clean = value?.replace(/[^0-9.-]+/g, '') ?? '0';
	return parseFloat(clean);
}

export function currencySortFn(
	rowA: { getValue: (id: string) => string },
	rowB: { getValue: (id: string) => string },
	columnId: string
): number {
	const a = parseCurrency(rowA.getValue(columnId));
	const b = parseCurrency(rowB.getValue(columnId));
	return a - b;
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
	update_property: 'update_property',
	detail: 'detail',
};

/**
 * Post Data for Add Deal
 */
export const formSchema = z.object({
	id: z.string().optional(),
	address: z.string().min(1, { message: 'Address is required' }),
	units: z.number().min(1, { message: 'Units is required' }),
	purchase_date: z.coerce.date({
		required_error: 'Purchase date is required',
		invalid_type_error: 'Invalid date format',
	}),
	purchase_price: z.string().min(1, { message: 'Purchase price is required' }),
	sale_price: z.string().optional(),
	gross_profit: z.string().optional(),
	estimated_value: z.string().optional(),
	down_payment_reserves: z.string().min(1, { message: 'Down payment & reserves is required' }),
	unstabilized_projected_income: z
		.string()
		.min(1, { message: 'Unstabilized projected income is required' }),
	current_realized_income: z.string().min(1, { message: 'Current realized income is required' }),
	rent_increase_percent: z.string().min(1, { message: 'Rent increase percent is required' }),
	refinance_valuation: z.string().optional(),
	sale_or_refinance_date: z.coerce.date().optional(),
	major_capital_event: z.boolean({
		required_error: 'Please indicate if there was a major capital event',
	}),
	estimated_irr: z.string().optional(),
});

export function buildPostDataForAddProperty(values: z.infer<typeof formSchema>, isNew: boolean) {
	return {
		address: values.address,
		current_realized_income: values.current_realized_income,
		down_payment_reserves: values.down_payment_reserves,
		estimated_irr: values.estimated_irr,
		estimated_value: values.estimated_value,
		gross_profit: values.gross_profit,
		id: isNew ? uuidv4() : values.id,
		major_capital_event: values.major_capital_event,
		purchase_date:
			(values.purchase_date as unknown as Date)?.toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}) || '',
		purchase_price: values.purchase_price,
		refinance_valuation: values.refinance_valuation,
		rent_increase_percent: values.rent_increase_percent,
		sale_or_refinance_date:
			(values.sale_or_refinance_date as unknown as Date)?.toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			}) || '',
		sale_price: values.sale_price,
		units: values.units,
		unstabilized_projected_income: values.unstabilized_projected_income,
	};
}

export const ADMIN_LIST = process.env.NEXT_PUBLIC_ADMIN_LIST?.split(',');
