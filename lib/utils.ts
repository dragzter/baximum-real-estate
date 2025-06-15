import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return amount.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	});
}

export function formatCurrencyOnChange(key, value: string, form) {
	const raw = value.replace(/[^0-9.]/g, "");
	const parsed = parseFloat(raw);

	const formatted = isNaN(parsed) ? "" : `$${parsed.toLocaleString()}`;

	form.setValue(key, formatted);
}

export function parseCurrency(value: string | number): number {
	if (typeof value === "number") return value;
	const clean = value?.replace(/[^0-9.-]+/g, "") ?? "0";
	return parseFloat(clean);
}

export function currencySortFn(
	rowA: { getValue: (id: string) => string },
	rowB: { getValue: (id: string) => string },
	columnId: string
): number {
	const a = parseCurrency(rowA.getValue(columnId));
	const b = parseCurrency(rowB.getValue(columnId));
	return a - b;
}

// export function numberSortingFn(
// 	rowA: { getValue: (id: string) => string },
// 	rowB: { getValue: (id: string) => string },
// 	columnId: string
// ) {
// 	const a = parseInt(rowA.getValue(columnId));
// 	const b = parseInt(rowB.getValue(columnId));
// 	return a - b;
// }

export const DATA_KEYS = {
	address: "Address",
	units: "Units",
	purchase_date: "Purchase Date",
	purchase_price: "Purchase Price",
	down_payment_reserves: "Down Payment Closing & Reserves",
	unstabilized_projected_income: "Unstabilized Scheduled Income",
	current_realized_income: "Current or Realized Income",
	rent_increase_percent: "% Increased in Rent",
	estimated_value: "Total Estimated Value",
	refinance_valuation: "Refinance Valuation",
	sale_price: "Sale Price",
	gross_profit: "Gross Profit or Gross Appreciation",
	sale_or_refinance_date: "Sale or Refinance Date",
	number_units_stabilized: "Number of Units Stabilized",
	number_units_unstabilized: "Number of Units Unstabilized",
	major_capital_event: "Major Capital Event Already Executed",
	estimated_irr: "Estimated IRR (Not Including Distributions)",
};

export const VIEWS = {
	dashboard: "dashboard",
	property_list: "property_list",
	add_property: "add_property",
	update_property: "update_property",
	detail: "detail",
};

/**
 * Post Data for Add Deal
 */
export const formSchema = z.object({
	id: z.string().optional(),
	address: z.string().min(1, { message: "Address is required" }),
	units: z.number().min(1, { message: "Units is required" }),
	number_units_stabilized: z.number().optional(),
	number_units_unstabilized: z.number().optional(),
	purchase_date: z.coerce.date({
		required_error: "Purchase date is required",
		invalid_type_error: "Invalid date format",
	}),
	purchase_price: z.string().min(1, { message: "Purchase price is required" }),
	sale_price: z.string().optional(),
	gross_profit: z.string().optional(),
	estimated_value: z.string().optional(),
	down_payment_reserves: z.string().min(1, { message: "Down payment & reserves is required" }),
	unstabilized_projected_income: z.string().min(1, { message: "Unstabilized projected income is required" }),
	current_realized_income: z.string().min(1, { message: "Current realized income is required" }),
	rent_increase_percent: z.string().min(1, { message: "Rent increase percent is required" }),
	refinance_valuation: z.string().optional(),
	sale_or_refinance_date: z.coerce.date().optional(),
	major_capital_event: z.boolean({
		required_error: "Please indicate if there was a major capital event",
	}),
	estimated_irr: z.string().optional(),
});

export function buildPostDataForAddProperty(values: z.infer<typeof formSchema>, isNew: boolean) {
	return {
		address: values.address,
		current_realized_income: values.current_realized_income,
		down_payment_reserves: values.down_payment_reserves,
		estimated_irr: values.estimated_irr,
		estimated_value: values.estimated_value,
		gross_profit: values.gross_profit,
		id: isNew ? uuidv4() : values.id,
		major_capital_event: values.major_capital_event,
		purchase_date:
			(values.purchase_date as unknown as Date)?.toLocaleDateString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}) || "",
		purchase_price: values.purchase_price,
		refinance_valuation: values.refinance_valuation,
		rent_increase_percent: values.rent_increase_percent,
		sale_or_refinance_date:
			(values.sale_or_refinance_date as unknown as Date)?.toLocaleDateString("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}) || "",
		sale_price: values.sale_price,
		units: values.units,
		number_units_stabilized: values.number_units_stabilized,
		number_units_unstabilized: values.number_units_unstabilized,
		unstabilized_projected_income: values.unstabilized_projected_income,
	};
}

const wrongMessage = [
	"Password is wrong.",
	"Still wrong.",
	"You're not getting this, are you?",
	"That's... not it either.",
	"Try again, maybe with feeling.",
	"Nope. Swing and a miss.",
	"Just typing things now, huh?",
	"Getting colder.",
	"Your keyboard might be cursed.",
	"Wronger than ever.",
	"Are you even trying?",
	"Yikes. That was painful.",
	"Your password guesses need therapy.",
	"This isn't Minesweeper — stop clicking random stuff.",
	"Have you tried 'password123'? (Don't.)",
	"Did your cat walk across the keyboard?",
	"Close! Just kidding. Not close.",
	"Maybe take a break?",
	"The password fairy isn’t helping today.",
	"Try flipping your keyboard upside down. That might help.",
	"Still not the password. Wild, right?",
	"Is this performance art?",
	"Guessing isn't a strategy.",
	"Hot tip: thinking helps.",
	"Nope. But that was a nice try.",
	"The password is not inside your soul.",
	"Each wrong try makes me stronger.",
	"You’re feeding me wrong answers like candy.",
	"If passwords were pizza, you'd still be hungry.",
	"You must be the chosen one... chosen to fail.",
	"Impressively consistent... at being wrong.",
	"Ever considered a career in guessing?",
	"Wronger than a pineapple on pizza (controversial).",
	"You miss 100% of the passwords you don’t know.",
	"You're not hacking the Pentagon here.",
	"Have you tried whispering sweet nothings to your keyboard?",
	"Incorrect. Like your taste in movies.",
	"This isn’t a riddle. Just a password.",
	"You're starting to worry me.",
	"Even a blind squirrel finds a nut eventually.",
	"My imaginary friend guessed better than that.",
	"Think. Then type. In that order.",
	"Wrong again. But who's counting? (Me.)",
	"If at first you don’t succeed... you know the rest.",
	"Did you fall asleep on the keyboard?",
	"Your fingers are just freestyling now.",
	"Getting warmer... not really.",
	"Nope. Not even in the ballpark.",
	"You're treating this like a slot machine.",
	"Maybe the password changed itself out of pity.",
	"I believe in you. Kinda.",
	"Hope is not a strategy.",
	"Have you considered using the correct password?",
	"Incorrect. But entertaining.",
	"If only this were an art contest.",
	"This is going in your permanent record.",
	"You’re making history. Bad history.",
	"You’re not even close. Like, continent-level far.",
	"You type like you’re solving a mystery novel.",
	"This is painful for both of us.",
	"The password is judging you.",
	"Have you tried consulting the oracle?",
	"This is not how hacking works in movies.",
	"Computers don’t cry, but they feel sadness too.",
	"You're on fire! Oh wait — that’s just failure.",
	"Your dedication to being wrong is impressive.",
	"Each try is a little more disappointing.",
	"Somewhere, a keyboard weeps.",
	"Even autocorrect gave up on you.",
	"Try again. And again. And again...",
	"Don’t worry, persistence is cute. Ish.",
	"This is why we can’t have nice things.",
	"Oof. That one hurt.",
	"Incorrect, but you’ve got moxie.",
	"You could write a book called ‘How Not to Password.’",
	"I’ve notified the Guessing Police.",
	"You're like a magician, but your trick is failing.",
	"That password belongs in the trash.",
	"One more wrong guess and I evolve into Clippy.",
	"I'd suggest asking for help. Like, now.",
	"You've tried everything... except the right thing.",
	"If this were a game, you’d be losing.",
	"Wrong. But enthusiastic!",
	"Would you like a hint? (Too bad!)",
	"The password is not the friends we made along the way.",
	"I’m starting to think you don’t know it.",
	"At this point, it’s tradition.",
	"You and the right password have never met.",
	"Nope. Try yelling at the screen. That helps.",
	"You're going to sprain a finger at this rate.",
	"Even the electrons are confused.",
	"You've almost reached 'legendary failure' status.",
	"This password has dodged you like Neo in The Matrix.",
	"You're building character, not progress.",
	"You deserve a participation trophy.",
	"You’ve got the persistence of a broken Roomba.",
	"You’ve tried everything except reading instructions.",
	"Nope. Still nope.",
	"That’s so wrong it might be a feature.",
	"Wrong again. But hey, it’s consistent.",
	"The suspense is killing nobody.",
	"Last one was your worst one yet.",
	"Maybe the password changed its mind.",
	"You've hit rock bottom. There's a trapdoor.",
	"You broke the record for consecutive bad guesses!",
	"You did it! Another incorrect entry!",
	"I'm not angry. I'm just disappointed.",
];

const moreWrongMessages = [
	"Seriously?",
	"You're inventing new ways to be wrong.",
	"Are you just pressing keys randomly?",
	"Wrong again. But who’s counting? Oh right, me.",
	"Each guess brings us further from hope.",
	"You're like a bad magician — all misdirection.",
	"This password ain’t gonna guess itself… but you shouldn’t either.",
	"Wow. Just wow.",
	"If wrong was an Olympic sport, you'd medal.",
	"Wronger than a fork in a toaster.",
	"Is this your idea of brute force?",
	"Did a raccoon guess that one?",
	"Incorrect. But inspiringly off-base.",
	"That guess hurt my circuits.",
	"New record: least accurate password attempt.",
	"You're password-adjacent. Very adjacent.",
	"If this were darts, you'd hit the wall.",
	"Missed it by a mile. And another mile.",
	"Your password instincts are… unique.",
	"That's a bold strategy, Cotton.",
	"This attempt brought shame to your ancestors.",
	"Not even spellcheck believes in you anymore.",
	"That guess was more fiction than fact.",
	"You’ve reached expert-level failure.",
	"Are you password-phobic?",
	"You're playing password roulette.",
	"This isn’t a brainstorming session.",
	"Password validation... still not validating you.",
	"Have you tried 'the right one'?",
	"The answer is out there. Just not in your brain.",
	"This is like watching a slow-motion typo.",
	"Try less hard. Or try smarter.",
	"That guess was... abstract.",
	"It's giving 'wrong energy'.",
	"The password is literally crying right now.",
	"Every attempt digs a deeper hole.",
	"You're approaching password purgatory.",
	"That guess was aggressively incorrect.",
	"You're making history — badly.",
	"You’ve wandered into the realm of nonsense.",
	"Nope. And this one wasn’t even creative.",
	"This isn't improv night.",
	"Still no. I'm beginning to think you like this.",
	"You're committed. Wrong, but committed.",
	"You're creating an encyclopedia of failure.",
	"Next guess: your keyboard combusts.",
	"Please stop. You're embarrassing us both.",
	"This isn't your strong suit, is it?",
	"At least you're consistent.",
	"If only sarcasm unlocked the password.",
	"Your guessing strategy: chaos.",
	"Even Clippy gave up.",
	"Try again. My disappointment is measurable.",
	"Each guess is a cry for help.",
	"You're entering uncharted levels of wrong.",
	"Password? No. Puzzle? Maybe.",
	"Ever considered password amnesia?",
	"You’re speedrunning failure.",
	"You're doing amazing... at being wrong.",
	"If you guess one more time, I might combust.",
	"Does your keyboard need therapy?",
	"At this point, it's performance art.",
	"I'm starting to think you don't *have* a password.",
	"Wow, you're really digging in.",
	"Is this an escape room puzzle to you?",
	"Still no. But nice try.",
	"You're stuck in a loop of wrong.",
	"Plot twist: there is no password.",
	"You've unlocked... absolutely nothing.",
	"Try flipping the table.",
	"Even your alter ego wouldn't guess that.",
	"Still not it. Back to the drawing board.",
	"You're inventing your own security system.",
	"That guess took bravery. But still wrong.",
	"404: Password not found.",
	"Pro tip: guessing isn't a long-term plan.",
	"We're approaching quantum levels of failure.",
	"Your guesses are statistically improbable.",
	"You're on a roll. A bad one.",
	"This is the opposite of progress.",
	"That one was so wrong it looped back to hilarious.",
	"Incorrect. But fun to watch.",
	"Did you ask a parrot to type that?",
	"If this were a game show, you'd be escorted out.",
	"You're one guess away from enlightenment. (Not really.)",
	"That was password fan fiction.",
	"Wrong with flair. Still wrong though.",
	"That one made the firewall laugh.",
	"You're not locked out yet? Impressive.",
	"Have you tried logging in with confidence?",
	"That password came from another timeline.",
	"Congratulations! Another failure.",
	"I'm proud of your persistence. Not your accuracy.",
	"Even ChatGPT couldn't help you now.",
	"Try shaking the monitor next.",
	"That's a great password — for a different account.",
	"This isn't a therapy session. It's a login.",
	"That guess belongs in the hall of shame.",
	"Try again, but pretend you're someone smarter.",
	"Wrong again. Have you considered interpretive dance?",
	"Still incorrect. But you're killing time beautifully.",
	"You should write a book called 'My Password Journey'.",
	"This is like a romantic comedy... without the romance. Or comedy.",
	"You're at the boss level of wrong.",
	"Nice try, Gandalf. But the password shall not pass.",
	"You’ve reached the end of the list. But not the right password.",
];

export const allWrongMessages = [...wrongMessage, ...moreWrongMessages];
