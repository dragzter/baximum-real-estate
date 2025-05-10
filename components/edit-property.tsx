"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { buildPostDataForAddProperty, cn, DATA_KEYS, formatCurrencyOnChange, formSchema, VIEWS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Deal } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { useDealsStore, useGeneralAppStateStore } from "@/lib/store";
import { isEqual } from "lodash-es";

export default function EditPropertyForm({ editId }) {
	const getProperty = useDealsStore((s) => s.getProperty);
	const [property, setProperty] = useState({} as Deal);
	const [dataIsUnchanged, setDataIsUnchanged] = useState();
	const dataIsUnchangedRef = useRef(true);
	const setView = useGeneralAppStateStore((s) => s.setView);
	const updateDeal = useDealsStore((s) => s.updateDeal);

	useEffect(() => {
		if (editId) {
			(async function () {
				const property = await getProperty(editId as string);
				setProperty(property);
			})();
		}
	}, [editId, getProperty]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: "",
			units: 1,
			number_units_stabilized: 0,
			number_units_unstabilized: 0,
			purchase_price: "",
			down_payment_reserves: "",
			unstabilized_projected_income: "",
			current_realized_income: "",
			sale_price: "",
			gross_profit: "",
			estimated_value: "",
			rent_increase_percent: "",
			refinance_valuation: "",
			purchase_date: undefined,
			sale_or_refinance_date: undefined,
			major_capital_event: false,
			estimated_irr: "",
		},
	});

	useEffect(() => {
		if (property) {
			const fProperty = {
				...property,
				purchase_date: property.purchase_date ? new Date(property.purchase_date) : undefined,
				sale_or_refinance_date: property.sale_or_refinance_date ? new Date(property.sale_or_refinance_date) : undefined,
			};

			const sub = form.watch((value) => {
				const unchanged = isEqual(value, fProperty);
				dataIsUnchangedRef.current = unchanged;
				setDataIsUnchanged(unchanged);
			});

			return () => sub.unsubscribe();
		}
	}, [form, property, setDataIsUnchanged, dataIsUnchanged]);

	useEffect(() => {
		if (property) {
			form.reset({
				...property,
				purchase_date: property.purchase_date ? new Date(property.purchase_date) : undefined,
				sale_or_refinance_date: property.sale_or_refinance_date ? new Date(property.sale_or_refinance_date) : undefined,
			});
		}
	}, [property]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const property: Deal = buildPostDataForAddProperty(values, false);
			//await axios.post('/api/property', { property });
			await updateDeal(property.id, property);

			console.log(property);
			toast.success("Property updated successfully!");

			setTimeout(() => {
				setView(VIEWS.property_list);
			}, 400);

			//form.reset();
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, (errors) => {
					console.error("Validation errors:", errors);
				})}
				onError={(error) => console.log("Error!", error)}
				className="space-y-8 max-w-4xl py-2"
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Input placeholder="123 Fake Street, Anytown FS, 01234" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="units"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{DATA_KEYS.units}</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Units"
										value={field.value}
										onChange={(e) => {
											const parsed = parseInt(e.target.value, 10);
											field.onChange(isNaN(parsed) ? "" : parsed);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="number_units_stabilized"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{DATA_KEYS.number_units_stabilized}</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Stabilized Units"
										value={field.value}
										onChange={(e) => {
											const parsed = parseInt(e.target.value, 10);
											field.onChange(isNaN(parsed) ? "" : parsed);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="number_units_unstabilized"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{DATA_KEYS.number_units_unstabilized}</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="Unstabilized Units"
										value={field.value}
										onChange={(e) => {
											const parsed = parseInt(e.target.value, 10);
											field.onChange(isNaN(parsed) ? "" : parsed);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="purchase_price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Purchase Price</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("purchase_price", e.target.value, form)}
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
								<FormLabel>{DATA_KEYS.purchase_date}</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(" pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
											>
												{field.value ? format(field.value, "MM/dd/yyyy") : <span>Pick a date</span>}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto property-date p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
											fromYear={1990} // Optional: start year
											toYear={2025}
											month={field.value ?? undefined}
											captionLayout="dropdown"
											classNames={{
												caption_dropdowns: "flex gap-2 justify-center",
												dropdown: "border rounded px-2 py-1 text-sm bg-white dark:bg-zinc-900",
											}}
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
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("down_payment_reserves", e.target.value, form)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("unstabilized_projected_income", e.target.value, form)}
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
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("current_realized_income", e.target.value, form)}
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

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
					<FormField
						control={form.control}
						name="estimated_value"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estimated Value</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("estimated_value", e.target.value, form)}
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
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("sale_price", e.target.value, form)}
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
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("gross_profit", e.target.value, form)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="major_capital_event"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<FormLabel>Major Capital Event</FormLabel>
									<FormDescription>Did the property have a major capital event?</FormDescription>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
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
												variant={"outline"}
												className={cn(" pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
											>
												{field.value ? format(field.value, "MM/dd/yyyy") : <span>Pick a date</span>}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 property-date" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											fromYear={1990} // Optional: start year
											toYear={2025}
											captionLayout="dropdown"
											month={field.value ?? undefined}
											classNames={{
												caption_dropdowns: "flex gap-2 justify-center",
												dropdown: "border rounded px-2 py-1 text-sm bg-white dark:bg-zinc-900",
											}}
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>Date of major capital event, sale or refinance.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="estimated_irr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estimated IRR %</FormLabel>
								<FormControl>
									<Input type="text" placeholder="100%" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="refinance_valuation"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{DATA_KEYS.refinance_valuation}</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder={"$1,000"}
										value={
											field.value && !isNaN(Number(field.value.replace(/[^0-9.]/g, "")))
												? `$${Number(field.value.replace(/[^0-9.]/g, "")).toLocaleString()}`
												: ""
										}
										onChange={(e) => formatCurrencyOnChange("refinance_valuation", e.target.value, form)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button disabled={dataIsUnchanged} type="submit" className={"cursor-pointer"}>
					Edit Property
				</Button>
				{dataIsUnchanged && (
					<p className={"text-sm mt-2 text-rose-500  ms-4 inline-block"}>Modify at least one value.</p>
				)}
			</form>
		</Form>
	);
}
