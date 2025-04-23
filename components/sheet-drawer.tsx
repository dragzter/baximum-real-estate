import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	//SheetClose,
	SheetContent,
	SheetDescription,
	//SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { House } from 'lucide-react';
0;

// 👇 Accept "children" like a Vue slot
export function SheetDrawer({
	children,
	buttonText = 'Open',
}: {
	children: ReactNode;
	buttonText: string;
}) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className={'cursor-pointer'} variant="outline">
					<House /> {buttonText}
				</Button>
			</SheetTrigger>

			<SheetContent>
				<SheetHeader>
					<SheetTitle>Select Property</SheetTitle>
					<SheetDescription>Select a property to see data.</SheetDescription>
				</SheetHeader>

				<div className="grid gap-4 p-4 overflow-y-auto">{children}</div>
			</SheetContent>
		</Sheet>
	);
}
