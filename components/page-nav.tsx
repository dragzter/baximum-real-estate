'use client';

import Image from 'next/image';
import Link from 'next/link';
import { NavMenuDropdown } from '@/components/nav-menu-dropdown';

export default function PageNav() {
	return (
		<nav className="border-b px-6 py-4 flex items-center justify-between bg-background">
			<div className="text-2xl font-bold">
				<Link href={'/'} className="flex items-center gap-2">
					<Image src={'/bax_logo.png'} priority width={130} height={0} alt={'logo'} />
				</Link>
			</div>

			<p className={'font-bold text-orange-600 ms-auto me-4'}>BETA</p>

			<div className="space-x-4">
				<NavMenuDropdown />
			</div>
		</nav>
	);
}
