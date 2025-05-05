'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import PageNav from '@/components/page-nav';
import { Bot, Check, Copy, ExternalLink, LayoutDashboard, List, Plus } from 'lucide-react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { SheetDrawer } from '@/components/sheet-drawer';
import { Deal } from '@/lib/types';
import { PropertyTable } from '@/components/property-table';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useDealsStore, useGeneralAppStateStore, useUserStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { VIEWS } from '@/lib/utils';
import AddProperty from '@/components/add-property';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import EditPropertyForm from '@/components/edit-property';

type Chat = {
	q: string;
	a: string;
};

export default function Dashboard() {
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);
	const [chats, setChats] = useState<Chat[]>([]);
	const [copied, setCopied] = useState(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
	const { user, isLoading } = useUser();
	const [editId, setEditId] = useState('');
	const [editPropertyAddress, setEditPropertyAddress] = useState('');
	const getUser = useUserStore((s) => s.getUser);
	const setView = useGeneralAppStateStore((s) => s.setView);
	const view = useGeneralAppStateStore((s) => s.view);
	const isDashBoard = view === VIEWS.dashboard;
	const router = useRouter();
	const deals = useDealsStore((s) => s.properties);

	const getProperties = useDealsStore((s) => s.getProperties);

	React.useEffect(() => {
		async function fetchProperties() {
			try {
				await getProperties(); // This updates the store
			} catch (err) {
				console.error('Failed to fetch properties:', err);
			}
		}
		fetchProperties();
	}, [getProperties]);

	const handleKeyDown = async (event: Event, text: string) => {
		if (
			(event as KeyboardEvent)?.key === 'Enter' &&
			!(event as KeyboardEvent)?.shiftKey &&
			!loading &&
			text.trim()
		) {
			await askAi(text);
		} else {
			return;
		}
	};

	const editDeal = (deal: Deal) => {
		setEditId(deal.id);
		setEditPropertyAddress(deal.address);
		setView(VIEWS.update_property);
	};

	useEffect(() => {
		if (!isLoading) {
			if (user?.sub) {
				(async () => {
					await getUser(encodeURIComponent(user.sub as string));
				})();
			} else {
				router.push('/');
			}
		}
	}, [user, getUser, isLoading, router]);

	const selectedProperty = useMemo(() => {
		return deals.find((deal) => deal.id === selectedPropertyId);
	}, [selectedPropertyId, deals]);

	const selectProperty = (deal: Deal) => {
		setSelectedPropertyId(deal.id);
	};

	const askAi = async (text: string) => {
		try {
			setLoading(true);

			const payload: { data: string; supporting?: undefined | string; isDashBoard: boolean } =
				{
					data: text,
					supporting: undefined,
					isDashBoard,
				};

			if (selectedProperty && view === VIEWS.dashboard) {
				payload.supporting = JSON.stringify(selectedProperty);
			}

			if (view !== VIEWS.dashboard) {
				payload.supporting = JSON.stringify(deals);
			}

			const resp = await axios.post('/api/ai', payload);
			const newChat: Chat = {
				q: text,
				a: resp.data.result,
			};

			setText('');
			setChats((prevChats) => [newChat, ...prevChats]);
			setLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	// Return nothing if not logged in
	if (isLoading || !user) {
		return null;
	}

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

						{selectedProperty && isDashBoard && (
							<p className="bg-purple-50 text-teal-700 px-4 py-2 rounded-md border">
								Asking about: {selectedProperty?.address}
							</p>
						)}

						{!isDashBoard && (
							<p className="bg-purple-50 text-teal-700 px-4 py-2 rounded-md border">
								Querying All Properties
							</p>
						)}
						<Textarea
							placeholder="Type your message here."
							className="h-24"
							onKeyDown={(event) => handleKeyDown(event as never, text)}
							value={text}
							onChange={(e) => setText(e?.target?.value || '')}
						/>
						<Button
							disabled={text.trim() === '' || loading}
							onClick={() => askAi(text)}
							className="h-12 px-5 text-lg flex items-center cursor-pointer gap-2"
						>
							{loading && <Loader2 className="animate-spin" />}
							{!loading && <Bot className="h-5 w-5" />}
							Ask Question
						</Button>
					</div>
				</div>

				<div
					id={'deals-dashboard'}
					className="w-3/4 p-6 bg-background h-[calc(100vh-84px)] overflow-y-auto min-w-[350px]"
				>
					<div className="mb-8 flex items-center justify-start gap-4 flex-wrap">
						{view === VIEWS.property_list && (
							<div>
								<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
									Property Master List
								</p>
								<h2 className="text-3xl font-bold text-foreground">
									Global Deals List
								</h2>
								<p className={'text-xs mt-2'}>
									Add a new deal:{' '}
									<Button
										size={'sm'}
										variant={'outline'}
										className={' cursor-pointer'}
										onClick={() => setView(VIEWS.add_property)}
									>
										Add New Deal <Plus />
									</Button>
								</p>
							</div>
						)}

						{view === VIEWS.dashboard && (
							<div>
								<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
									Deal Statistics
								</p>
								<h2 className="text-3xl font-bold text-foreground">
									Deals Dashboard
								</h2>
								<p className={'text-xs mt-2'}>
									View individual properties:{' '}
									<Button
										size={'sm'}
										variant={'outline'}
										className={' cursor-pointer'}
										onClick={() => setView(VIEWS.detail)}
									>
										Property Details <ExternalLink />
									</Button>
								</p>
							</div>
						)}

						{view === VIEWS.update_property && (
							<div>
								<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
									edit Deal
								</p>
								<h2 className="text-3xl font-bold text-foreground">
									Editing Deal: {editPropertyAddress}
								</h2>
								<p className={'text-xs mt-2'}>
									Edit Deal values and submit changes.{' '}
									<Button
										size={'sm'}
										variant={'outline'}
										className={' cursor-pointer'}
										onClick={() => setView(VIEWS.property_list)}
									>
										Back To List <List />
									</Button>
								</p>
							</div>
						)}

						{view === VIEWS.add_property && (
							<div>
								<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
									New Deal
								</p>
								<h2 className="text-3xl font-bold text-foreground">
									Adding Real Estate Deal
								</h2>
								<p className={'text-xs mt-2'}>
									View all deals:{' '}
									<Button
										size={'sm'}
										variant={'outline'}
										className={' cursor-pointer'}
										onClick={() => setView(VIEWS.property_list)}
									>
										List <List />
									</Button>
								</p>
							</div>
						)}

						{view === VIEWS.detail && (
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
								<p className={'text-xs mt-2'}>
									View property dashboard:{' '}
									<Button
										size={'sm'}
										variant={'outline'}
										className={' cursor-pointer'}
										onClick={() => setView(VIEWS.dashboard)}
									>
										Dashboard <LayoutDashboard />
									</Button>
								</p>
							</div>
						)}

						{view === VIEWS.detail && (
							<SheetDrawer buttonText={'Select Property'}>
								{deals.map((deal) => (
									<Card
										key={deal.id}
										onClick={() => selectProperty(deal)}
										className="group cursor-pointer rounded-lg border border-muted bg-background p-3 shadow-sm transition hover:border-primary hover:shadow-md min-w-[220px]"
									>
										<div className="space-y-1">
											<h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
												{deal.address}
											</h3>
											<p className="text-sm  font-bold leading-tight">
												<span
													className={'text-muted-foreground font-normal'}
												>
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
						)}
					</div>
					{view === VIEWS.detail && selectedProperty && (
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
					{view === VIEWS.property_list && (
						<div className="grid grid-cols-4 md:grid-cols-1 gap-6 mt-8">
							<PropertyTable properties={deals} handleEditProperty={editDeal} />
						</div>
					)}
					{view === VIEWS.add_property && (
						<div className="grid h-[calc(100vh-84px)] grid-cols-1 gap-4 mt-2">
							<AddProperty handleDealAdded={getProperties} />
						</div>
					)}
					{view === VIEWS.update_property && (
						<div className="grid h-[calc(100vh-84px)] grid-cols-1 gap-4 mt-2">
							<EditPropertyForm editId={editId} />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
