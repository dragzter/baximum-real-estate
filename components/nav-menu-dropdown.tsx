'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { House, LogOut, Radar, User } from 'lucide-react';
import { useGeneralAppStateStore, useUserStore } from '@/lib/store';
import Link from 'next/link';

export function NavMenuDropdown() {
	const _user = useUserStore((s) => s.user);
	const setDashboardView = useGeneralAppStateStore((s) => s.setIsDashboard);
	const isDashbaord = useGeneralAppStateStore((s) => s.isDashboard);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button style={{ cursor: 'pointer' }} variant="outline">
					<User /> {_user?.name ? _user.name : 'User'}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setDashboardView(false)}
					>
						<House className={`h-4 w-4 ${!isDashbaord && 'link-active'}`} /> All
						Properties
					</DropdownMenuItem>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setDashboardView(true)}
					>
						<Radar className={`h-4 w-4 ${isDashbaord ?? 'link-active'}`} /> Dashboard
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<Link
						href="/api/auth/logout"
						prefetch={false}
						replace
						className="flex items-center gap-2"
					>
						<LogOut className="h-4 w-4" />
						Log Out
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
