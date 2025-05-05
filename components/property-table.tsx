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
import { ArrowUpDown, Loader2, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { useEffect, useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Deal } from '@/lib/types';
import { currencySortFn, parseCurrency } from '@/lib/utils';
import { useDealsStore } from '@/lib/store';

export function PropertyTable({ properties, handleEditProperty }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState<Deal[]>([]);
	const loading = useDealsStore((s) => s.loading);
	const deleteDeal = useDealsStore((s) => s.deleteDeal);

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
			deleteDeal(id);
		},
		[deleteDeal]
	);

	const columns = useMemo<ColumnDef<Deal>[]>(
		() => [
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
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Purchase Price
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue('purchase_price'));
					return `$${val.toLocaleString()}`;
				},
			},

			{
				accessorKey: 'down_payment_reserves',
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Down Payment & Reserves
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue('down_payment_reserves'));
					return `$${val.toLocaleString()}`;
				},
			},
			{
				header: 'Purchase Date',
				accessorKey: 'purchase_date',
				cell: ({ row }) => new Date(row.getValue('purchase_date')).toLocaleDateString(),
			},
			{
				header: 'Sale Price',
				accessorKey: 'sale_price',
			},
			{
				header: 'Gross Profit',
				accessorKey: 'gross_profit',
			},
			{
				header: 'Percent Rent Increase',
				accessorKey: 'rent_increase_percent',
			},
			{
				accessorKey: 'estimated_value',
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Estimated Value
						<ArrowUpDown />
					</Button>
				),
				enableSorting: true,
				sortingFn: currencySortFn,
				cell: ({ row }) => {
					const val = parseCurrency(row.getValue('estimated_value'));
					return `$${val.toLocaleString()}`;
				},
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
			{
				header: 'Actions',
				id: 'actions',
				cell: ({ row }) => {
					const deal = row.original;

					return (
						<div className="flex gap-2">
							<Button
								variant="ghost"
								className={'cursor-pointer'}
								size="icon"
								onClick={() => handleUpdate(deal)}
							>
								<Pencil className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className={'cursor-pointer'}
								onClick={() => handleDelete(deal.id)}
							>
								<Trash2 className="h-4 w-4 text-red-500" />
							</Button>
						</div>
					);
				},
			},
		],
		[handleUpdate, handleDelete]
	);

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

	if (loading)
		return (
			<p className="p-4 flex">
				<Loader2 className={'animate-spin me-4'} /> Loading properties...
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
			<div className="rounded-md border h-[calc(100vh-300px)] overflow-auto">
				<Table className="min-h-full h-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={
											header.id === 'actions'
												? 'sticky right-0 z-10 bg-stone-50 border-l border-gray-200'
												: 'border-l border-gray-200'
										}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
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
										<TableCell
											key={cell.id}
											className={
												cell.column.id === 'actions'
													? 'sticky right-0 z-10 bg-stone-50 border-l border-gray-200'
													: 'border-l border-gray-200'
											}
										>
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
		</div>
	);
}
