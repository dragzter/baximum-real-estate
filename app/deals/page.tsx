'use client';

import PageNav from '@/components/page-nav';
import { PropertyTable } from '@/components/property-table';

export default function Deals() {
	return (
		<>
			<PageNav onClick={() => null} />
			<div
				id="properties-list"
				className="p-6 flex flex-col h-[calc(100vh-84px)] min-w-[400px]"
			>
				<div className="flex flex-col h-full w-full">
					<PropertyTable />
				</div>
			</div>
		</>
	);
}
