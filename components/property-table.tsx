'use client';

import * as React from 'react';
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
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { properties } from '@/lib/data';
import { Deal } from '@/lib/types';

const data: Deal[] = properties;

export const columns: ColumnDef<Deal>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && 'indeterminate')
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: 'address',
		header: 'Address',
	},
	{
		accessorKey: 'units',
		header: ({ column }) => {
			return (
				<Button
					style={{ paddingLeft: 0 }}
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Units
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue('units')}</div>,
	},
	{
		accessorKey: 'purchase_price',
		header: 'Purchase Price',
	},
	{
		header: () => 'Down Payment and Reserves',
		accessorKey: 'down_payment_reserves',
	},
	{
		header: 'Purchase Date',
		accessorKey: 'purchase_date',
		cell: ({ row }) => new Date(row.getValue('purchase_date')).toLocaleDateString(),
	},
	{
		header: 'Sale Value',
		accessorKey: 'sale_value',
	},
	{
		header: 'Gross Profit',
		accessorKey: 'gross_profit',
	},
	{
		header: 'Unstabilized Scheduled Income',
		accessorKey: 'unstabilized_projected_income',
	},
	{
		header: 'Current or Realized Income',
		accessorKey: 'current_realized_income',
	},
	{
		header: 'Capital Event Date',
		accessorKey: 'sale_or_refinance_date',
		cell: ({ row }) =>
			row.getValue('sale_or_refinance_date') &&
			new Date(row.getValue('sale_or_refinance_date')).toLocaleDateString(),
	},
	{
		header: 'Major Capital Event',
		accessorKey: 'major_capital_event',
		cell: ({ row }) => (row.getValue('major_capital_event') ? 'Yes' : 'No'),
	},
	{
		header: 'Estimated IRR',
		accessorKey: 'estimated_irr',
	},
];

export function PropertyTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

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

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				{/*<Input*/}
				{/*	placeholder="Filter emails..."*/}
				{/*	value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}*/}
				{/*	onChange={(event) =>*/}
				{/*		table.getColumn('email')?.setFilterValue(event.target.value)*/}
				{/*	}*/}
				{/*	className="max-w-sm"*/}
				{/*/>*/}
				<DropdownMenu>
					{/*<DropdownMenuTrigger asChild>*/}
					{/*	<Button variant="outline" className="ml-auto">*/}
					{/*		Columns <ChevronDown />*/}
					{/*	</Button>*/}
					{/*</DropdownMenuTrigger>*/}
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
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
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
			<div className="flex items-center justify-end space-x-2 py-4">
				{/*<div className="flex-1 text-sm text-muted-foreground">*/}
				{/*	{table.getFilteredSelectedRowModel().rows.length} of{' '}*/}
				{/*	{table.getFilteredRowModel().rows.length} row(s) selected.*/}
				{/*</div>*/}
				{/*<div className="space-x-2">*/}
				{/*	<Button*/}
				{/*		variant="outline"*/}
				{/*		size="sm"*/}
				{/*		onClick={() => table.previousPage()}*/}
				{/*		disabled={!table.getCanPreviousPage()}*/}
				{/*	>*/}
				{/*		Previous*/}
				{/*	</Button>*/}
				{/*	<Button*/}
				{/*		variant="outline"*/}
				{/*		size="sm"*/}
				{/*		onClick={() => table.nextPage()}*/}
				{/*		disabled={!table.getCanNextPage()}*/}
				{/*	>*/}
				{/*		Next*/}
				{/*	</Button>*/}
				{/*</div>*/}
			</div>
		</div>
	);
}
