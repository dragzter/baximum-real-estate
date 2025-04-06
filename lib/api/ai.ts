// lib/ai-controller.ts
import OpenAI from "openai";

interface AiControllerOptions {
  model?: string;
}

type Message = { role: "user" | "assistant" | "system"; content: string };

export class AiController {
  private openai: OpenAI;
  private model: string;
  private memory: Message[];
  private summaryMemory: Message[]; // compressed older memory
  private maxDetailedMessages: number;

  constructor(options: AiControllerOptions = {}) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY!,
    });

    this.model = options.model || "gpt-4";

    this.memory = []; // fresh conversation
    this.summaryMemory = [
      { role: "system", content: "You are a helpful AI assistant." },
    ];

    this.maxDetailedMessages = 20;
  }

  private async summarizeOldMemory(): Promise<void> {
    if (this.memory.length === 0) return;

    const summaryPrompt = `
Summarize the following conversation briefly, preserving important context:

${this.memory
  .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
  .join("\n")}
`;

    const summaryResponse = await this.openai.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You summarize conversations very concisely.",
        },
        { role: "user", content: summaryPrompt },
      ],
    });

    const summarizedContent = summaryResponse.choices[0]?.message?.content;

    if (summarizedContent) {
      // Append summarized content to summaryMemory
      this.summaryMemory.push({
        role: "system",
        content: "Summary so far: " + summarizedContent,
      });

      this.memory = [];
    }
  }

  async ask(prompt: string): Promise<string> {
    this.memory.push({ role: "user", content: prompt });

    // If detailed memory exceeds limit, summarize it
    if (this.memory.length > this.maxDetailedMessages) {
      await this.summarizeOldMemory();
    }

    // Combine summarized + detailed memory
    const fullMemory: Message[] = [...this.summaryMemory, ...this.memory];

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: fullMemory,
    });

    const aiReply = response.choices[0]?.message?.content;

    if (aiReply) {
      // Add AI's reply to detailed memory
      this.memory.push({ role: "assistant", content: aiReply });
    }

    console.log("AI Reply:", aiReply);

    return aiReply || "";
  }
}
