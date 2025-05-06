"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Deal } from "@/lib/types";
import { currencySortFn, DATA_KEYS, parseCurrency } from "@/lib/utils";
import { useDealsStore, useUserStore } from "@/lib/store";

export function PropertyTable({ properties, handleEditProperty }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState<Deal[]>([]);
	const loading = useDealsStore((s) => s.loading);
	const deleteDeal = useDealsStore((s) => s.deleteDeal);
	const isAdmin = useUserStore((s) => s.isAdmin);

	useEffect(() => {
		if (properties?.length) {
			setData(properties);
		}
	}, [properties]);

	function handleUpdate(deal: Deal) {
		handleEditProperty(deal);
	}

	const handleDelete = React.useCallback(
		async (id: string) => {
			const _delete = confirm("Are you sure?  This will permanently remove this deal.");
			if (_delete) {
				deleteDeal(id);
			}
		},
		[deleteDeal]
	);

	const columns = useMemo<ColumnDef<Deal>[]>(() => {
		let cols: ColumnDef<Deal>[] = [
			{
				accessorKey: "address",
				header: DATA_KEYS.address,
			},
			{
				accessorKey: "units",
				header: ({ column }) => {
					return (
						<Button
							style={{ paddingLeft: 0 }}
							variant="ghost"
							onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						>
							{DATA_KEYS.units}
							<ArrowUpDown />
						</Button>
					);
				},
				cell: ({ row }) => row.getValue("units"),
			},
			{
				accessorKey: "purchase_price",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.purchase_price}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("purchase_price"));
					return `$${val.toLocaleString()}`;
				},
			},
			{
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.purchase_date}
						<ArrowUpDown />
					</Button>
				),
				accessorKey: "purchase_date",
				cell: ({ row }) => {
					const raw = row.getValue("purchase_date");
					return raw ? new Date(raw as string).toLocaleDateString() : "";
				},
				sortingFn: (rowA, rowB, columnId) => {
					const dateA = new Date(rowA.getValue(columnId)).getTime();
					const dateB = new Date(rowB.getValue(columnId)).getTime();
					return dateA - dateB;
				},
			},
			{
				accessorKey: "down_payment_reserves",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.down_payment_reserves}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("down_payment_reserves"));
					return `$${val.toLocaleString()}`;
				},
			},
			{
				accessorKey: "estimated_value",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.estimated_value}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("estimated_value"));
					return row.getValue("estimated_value") ? `$${val.toLocaleString()}` : "";
				},
			},
			{
				accessorKey: "rent_increase_percent",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.rent_increase_percent}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				cell: ({ row }) => row.getValue("rent_increase_percent"),
			},
			{
				accessorKey: "unstabilized_projected_income",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.unstabilized_projected_income}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("unstabilized_projected_income"));
					return `$${val.toLocaleString()}`;
				},
			},
			{
				accessorKey: "current_realized_income",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.current_realized_income}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("current_realized_income"));
					return `$${val.toLocaleString()}`;
				},
			},
			{
				header: DATA_KEYS.major_capital_event,
				accessorKey: "major_capital_event",
				cell: ({ row }) => (row.getValue("major_capital_event") ? "Yes" : "No"),
			},
			{
				header: DATA_KEYS.sale_or_refinance_date,
				accessorKey: "sale_or_refinance_date",
				cell: ({ row }) =>
					row.getValue("sale_or_refinance_date") &&
					new Date(row.getValue("sale_or_refinance_date")).toLocaleDateString(),
			},
			{
				accessorKey: "refinance_valuation",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.refinance_valuation}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("refinance_valuation"));
					return row.getValue("refinance_valuation") ? `$${val.toLocaleString()}` : "";
				},
			},
			{
				accessorKey: "sale_price",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.sale_price}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("sale_price"));
					return row.getValue("sale_price") ? `$${val.toLocaleString()}` : "";
				},
			},
			{
				accessorKey: "gross_profit",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.gross_profit}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue("gross_profit"));
					return row.getValue("gross_profit") ? `$${val.toLocaleString()}` : "";
				},
			},
			{
				accessorKey: "estimated_irr",
				header: ({ column }) => (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						{DATA_KEYS.estimated_irr}
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				cell: ({ row }) => row.getValue("estimated_irr"),
			},
		];

		if (isAdmin) {
			cols = [
				...cols,
				{
					header: "Actions",
					id: "actions",
					cell: ({ row }) => {
						const deal = row.original;
						return (
							<div className="flex gap-2">
								<Button variant="ghost" className={"cursor-pointer"} size="icon" onClick={() => handleUpdate(deal)}>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="icon" className={"cursor-pointer"} onClick={() => handleDelete(deal.id)}>
									<Trash2 className="h-4 w-4 text-red-500" />
								</Button>
							</div>
						);
					},
				} as ColumnDef<Deal>,
			];
		}

		return cols;
	}, [handleUpdate, handleDelete, isAdmin]);

	useEffect(() => {
		if (isAdmin) {
		}
	});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	useEffect(() => {
		table.setPageSize(700);
	}, [table]);

	if (loading)
		return (
			<p className="p-4 flex">
				<Loader2 className={"animate-spin me-4"} /> Loading properties...
			</p>
		);

	return (
		<div className="w-full  h-full flex flex-col">
			<div className="flex  items-center py-4">
				<DropdownMenu>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border h-[calc(100vh-340px)] overflow-auto">
				<Table className="min-h-full h-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={
											header.id === "actions"
												? "sticky right-0 z-10 bg-stone-50 border-l border-gray-200"
												: "border-l border-gray-200"
										}
									>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={
												cell.column.id === "actions"
													? "sticky right-0 z-10 bg-stone-50 border-l border-gray-200"
													: "border-l border-gray-200"
											}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
