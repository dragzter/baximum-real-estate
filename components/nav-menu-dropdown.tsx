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
import { Glasses, House, Loader2, LogOut, Plus, Radar, User } from 'lucide-react';
import { useGeneralAppStateStore, useUserStore } from '@/lib/store';
import Link from 'next/link';
import { VIEWS } from '@/lib/utils';

export function NavMenuDropdown() {
	const _user = useUserStore((s) => s.user);
	const loading = useUserStore((s) => s.loading);
	const setView = useGeneralAppStateStore((s) => s.setView);
	// const view = useGeneralAppStateStore((s) => s.view);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button style={{ cursor: 'pointer' }} variant="outline">
					{loading || !_user ? (
						<Loader2 className="animate-spin" />
					) : (
						<>
							<User />
							{_user?.name || 'User'}
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setView(VIEWS.property_list)}
					>
						<House className={`h-4 w-4`} /> All Properties
					</DropdownMenuItem>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setView(VIEWS.dashboard)}
					>
						<Radar className={`h-4 w-4`} /> Dashboard
					</DropdownMenuItem>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setView(VIEWS.add_property)}
					>
						<Plus /> Add Property
					</DropdownMenuItem>
					<DropdownMenuItem
						style={{ cursor: 'pointer' }}
						onClick={() => setView(VIEWS.detail)}
					>
						<Glasses /> Details
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
