'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
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

export default function PropertyForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: '',
			units: 1,
			purchase_price: '',
			down_payment_reserves: '',
			unstabilized_projected_income: '',
			current_realized_income: '',
			sale_price: '',
			gross_profit: '',
			estimated_value: '',
			rent_increase_percent: '',
			refinance_valuation: '',
			purchase_date: undefined,
			sale_or_refinance_date: undefined,
			major_capital_event: false,
			estimated_irr: '',
		},
	});

	function formatCurrency(key, value: string) {
		const raw = value.replace(/[^0-9.]/g, '');
		const parsed = parseFloat(raw);

		const formatted = isNaN(parsed) ? '' : `$${parsed.toLocaleString()}`;

		form.setValue(key, formatted);
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);
			toast(
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(values, null, 2)}</code>
				</pre>
			);
		} catch (error) {
			console.error('Form submission error', error);
			toast.error('Failed to submit the form. Please try again.');
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (errors) => {
					console.error('Validation errors:', errors);
				})}
				onError={(error) => console.log('Error!', error)}
				className="space-y-8 max-w-4xl py-2"
			>
				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input placeholder="Property Address" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="units"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Units</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Units"
										value={field.value}
										onChange={(e) => {
											const parsed = parseInt(e.target.value, 10);
											field.onChange(isNaN(parsed) ? '' : parsed);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="purchase_price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Purchase Price</FormLabel>
								<FormControl>
									<Input
										type="text"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency('purchase_price', e.target.value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="purchase_date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Purchase Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													' pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(field.value, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="down_payment_reserves"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Down Payment & Reserves</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Reserves"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency('down_payment_reserves', e.target.value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="unstabilized_projected_income"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Unstabilized Income</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Projected"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency(
												'unstabilized_projected_income',
												e.target.value
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="current_realized_income"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Income</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Realized"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency(
												'current_realized_income',
												e.target.value
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="rent_increase_percent"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rent Increase Percent</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Increase %" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="estimated_value"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estimated Value</FormLabel>
								<FormControl>
									<Input
										type="text"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency('estimated_value', e.target.value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="sale_price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Sale Price</FormLabel>
								<FormControl>
									<Input
										type="text"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency('sale_price', e.target.value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="gross_profit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Gross Profit or Appreciation</FormLabel>
								<FormControl>
									<Input
										type="text"
										value={
											field.value &&
											!isNaN(Number(field.value.replace(/[^0-9.]/g, '')))
												? `$${Number(field.value.replace(/[^0-9.]/g, '')).toLocaleString()}`
												: ''
										}
										onChange={(e) =>
											formatCurrency('gross_profit', e.target.value)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="major_capital_event"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel>Major Capital Event</FormLabel>
									<FormDescription>
										Did the property have a major capital event?
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										aria-readonly
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="sale_or_refinance_date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Major Capital Event Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													' pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? (
													format(field.value, 'PPP')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Date of major capital event, sale or refinance.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="estimated_irr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estimated IRR %</FormLabel>
							<FormControl>
								<Input type="text" placeholder="Estimated IRR" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Add Property</Button>
			</form>
		</Form>
	);
}
