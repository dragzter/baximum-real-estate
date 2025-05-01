'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PageNav from '@/components/page-nav';
import { Bot, Check, Copy } from 'lucide-react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { SheetDrawer } from '@/components/sheet-drawer';
import { properties } from '@/lib/data';
import { Deal } from '@/lib/types';
import { PropertyTable } from '@/components/property-table';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useGeneralAppStateStore, useUserStore } from '@/lib/store';

type Chat = {
	q: string;
	a: string;
};

export default function Dashboard() {
	const [text, setText] = useState('');
	const [chats, setChats] = useState<Chat[]>([]);
	const [copied, setCopied] = useState(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
	const [firstPropertyMessage, setFirstPropertyMessage] = useState(false);
	const { user } = useUser();
	const getUser = useUserStore((s) => s.getUser);
	const isDashBoard = useGeneralAppStateStore((s) => s.isDashboard);

	const deals: Deal[] = useMemo(() => {
		return properties;
	}, []);

	useEffect(() => {
		if (user?.sub) {
			(async () => {
				await getUser(encodeURIComponent(user.sub as string));
			})();
		}
	}, [user, getUser]);

	const selectedProperty = useMemo(() => {
		return deals.find((deal) => deal.id === selectedPropertyId);
	}, [selectedPropertyId, deals]);

	const askAi = async (text: string) => {
		try {
			if (!firstPropertyMessage && selectedProperty) {
				text += `This is the relevant property: ${selectedProperty?.toString()}`;
				setFirstPropertyMessage(true);
			}

			const resp = await axios.post('/api/ai', { data: text });
			const newChat: Chat = {
				q: text,
				a: resp.data.result,
			};

			setText('');

			setChats((prevChats) => [newChat, ...prevChats]);
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<PageNav />

			<div className="flex">
				<div
					id="main-dashboard"
					className="w-1/4 p-6 border-r flex flex-col h-[calc(100vh-84px)] min-w-[400px]"
				>
					<div className="flex flex-col h-full w-full gap-2 ">
						<div
							id="ai-response-container"
							className="flex flex-col-reverse overflow-y-auto flex-1 gap-2 mb-2"
						>
							{chats.map((chat, index) => (
								<div key={index}>
									{/* User's Question */}
									<div className="p-3 rounded-md bg-muted border user-chat mb-2">
										<p className="text-sm text-muted-foreground font-semibold">
											You:
										</p>
										<p className="text-base">{chat.q}</p>
									</div>

									<div className="relative group p-3 rounded-md bg-[#fbfbfb] border border-purple-100 ai-chat mb-2">
										<button
											onClick={() => {
												navigator.clipboard.writeText(chat.a);
												setCopied(true); // ✅ Set copied true when clicked
												setTimeout(() => setCopied(false), 1500); // ✅
											}}
											className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
             text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-200 hover:bg-gray-300 cursor-pointer"
										>
											{copied ? (
												<Check className="h-5 w-5 text-green-600" />
											) : (
												<Copy className="h-5 w-5 py-1 text-muted-foreground" />
											)}
										</button>

										<p className="text-sm font-semibold text-cyan-500">AI:</p>
										<p className="text-base">{chat.a}</p>
									</div>
								</div>
							))}
						</div>

						{selectedProperty && (
							<p className="bg-purple-50 text-teal-700 px-4 py-2 rounded-md border">
								Asking about: {selectedProperty?.address}
							</p>
						)}
						<Textarea
							placeholder="Type your message here."
							className="h-24"
							value={text}
							onChange={(e) => setText(e?.target?.value || '')}
						/>
						<Button
							disabled={text.trim() === ''}
							onClick={() => askAi(text)}
							className="h-12 px-5 text-lg flex items-center gap-2"
						>
							<Bot className="h-5 w-5" />
							Ask Question
						</Button>
					</div>
				</div>

				<div
					id={'deals-dashboard'}
					className="w-3/4 p-6 bg-background overflow-y-auto min-w-[350px]"
				>
					<div className="mb-8 flex items-center justify-start gap-4 flex-wrap">
						<div>
							<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
								Selected Property
							</p>
							<h2 className="text-3xl font-bold text-foreground">
								{selectedProperty?.address || 'No Selection'}
							</h2>
							{selectedProperty?.purchase_price && (
								<p className="text-sm text-muted-foreground mt-4">
									Purchase Price: {selectedProperty.purchase_price}
									<span className={'ms-4 pill'}>
										Units: {selectedProperty?.units}
									</span>
									<span className={'ms-4 pill'}>
										Capital Event:
										{selectedProperty?.major_capital_event ? 'Yes' : 'No'}
									</span>
								</p>
							)}
						</div>

						<SheetDrawer buttonText={'Select Property'}>
							{deals.map((deal) => (
								<Card
									key={deal.id}
									onClick={() => setSelectedPropertyId(deal.id)}
									className="group cursor-pointer rounded-lg border border-muted bg-background p-3 shadow-sm transition hover:border-primary hover:shadow-md min-w-[220px]"
								>
									<div className="space-y-1">
										<h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
											{deal.address}
										</h3>
										<p className="text-sm  font-bold leading-tight">
											<span className={'text-muted-foreground font-normal'}>
												Sale Price:
											</span>
											<span> {deal.purchase_price}</span>
										</p>
										<p className="text-sm text-muted-foreground leading-tight">
											Units: {deal.units}
										</p>
									</div>
								</Card>
							))}
						</SheetDrawer>
					</div>
					{isDashBoard && (
						<div className="grid grid-cols-6 md:grid-cols-6 gap-6 mt-8">
							<div>
								Purchase Date:
								<br /> {selectedProperty?.purchase_date ?? 'N/A'}
							</div>
							<div>
								Down Payment: <br />
								{selectedProperty?.down_payment_reserves ?? 'N/A'}
							</div>
							<div>
								Sale: <br />
								{selectedProperty?.sale_price ?? 'N/A'}
							</div>
							<div>
								Gross Profit: <br />
								{selectedProperty?.gross_profit ?? 'N/A'}
							</div>
							<div>
								Unstabilized Income: <br />
								{selectedProperty?.unstabilized_projected_income ?? 'N/A'}
							</div>
							<div>
								Realized Income: <br />
								{selectedProperty?.current_realized_income ?? 'N/A'}
							</div>
							<div>
								Total Est. Value: <br />
								{selectedProperty?.estimated_value ?? 'N/A'}
							</div>
							<div>
								Refinance Valuation: <br />
								{selectedProperty?.refinance_valuation ?? 'N/A'}
							</div>
							<div>
								Rent Increase %: <br />
								{selectedProperty?.rent_increase_percent ?? 'N/A'}
							</div>
							<div>
								Capital Event Date : <br />
								{selectedProperty?.sale_or_refinance_date ?? 'N/A'}
							</div>
							<div>
								Estimated IRR: <br />
								{selectedProperty?.estimated_irr ?? 'N/A'}
							</div>
						</div>
					)}
					{!isDashBoard && (
						<div className="grid grid-cols-4 md:grid-cols-1 gap-6 mt-8">
							<PropertyTable />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
