import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, PlusSquare } from "lucide-react";
import * as React from "react";

export function PopoverQuestions({ question }) {
	const [open, setOpen] = React.useState(false); // State to control popover

	const questions = [
		"Which property had the shortest hold?",
		"How many properties are located in Manchester?",
		"Which property had the highest rent increase?",
		"Which property had the highest gross profit?",
		"What is the median sale price for multi-unit properties (5+ units)?",
		"How many properties are there?",
		"Which property had the most realized income?",
	];

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size={"lg"} onClick={() => setOpen(true)}>
					<MessageSquare />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Preset Questions</h4>
						<p className="text-sm text-muted-foreground">
							Select a preset question to query the AI about the listed properties.
						</p>
					</div>
					<div className={"flex flex-col items-start gap-3"}>
						{questions.map((q) => (
							<Button
								key={q}
								variant="ghost"
								size="sm"
								onClick={() => {
									question(q);
									setOpen(false);
								}}
							>
								<PlusSquare />
								{q}
							</Button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
