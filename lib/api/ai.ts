// lib/ai-controller.ts
import OpenAI from "openai";

interface AiControllerOptions {
  model?: string;
}

type Message = { role: "user" | "assistant" | "system"; content: string };

// export class AiController {
//   private openai: OpenAI;
//   private model: string;
//   private memory: Message[];
//   private summaryMemory: Message[]; // compressed older memory
//   private maxDetailedMessages: number;
//
//   constructor(options: AiControllerOptions = {}) {
//     this.openai = new OpenAI({
//       apiKey: process.env.OPEN_AI_API_KEY!,
//     });
//
//     this.model = options.model || "gpt-4";
//
//     this.memory = []; // fresh conversation
//     this.summaryMemory = [
//       { role: "system", content: "You are a helpful AI assistant." },
//     ];
//
//     this.maxDetailedMessages = 20;
//   }
//
//   private async summarizeOldMemory(): Promise<void> {
//     if (this.memory.length === 0) return;
//
//     const summaryPrompt = `
// Summarize the following conversation briefly, preserving important context:
//
// ${this.memory
//   .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
//   .join("\n")}
// `;
//
//     const summaryResponse = await this.openai.chat.completions.create({
//       model: this.model,
//       temperature: 0.3,
//       messages: [
//         {
//           role: "system",
//           content: "You summarize conversations very concisely.",
//         },
//         { role: "user", content: summaryPrompt },
//       ],
//     });
//
//     const summarizedContent = summaryResponse.choices[0]?.message?.content;
//
//     if (summarizedContent) {
//       // Append summarized content to summaryMemory
//       this.summaryMemory.push({
//         role: "system",
//         content: "Summary so far: " + summarizedContent,
//       });
//
//       this.memory = [];
//     }
//   }
//
//   async ask(prompt: string): Promise<string> {
//     this.memory.push({ role: "user", content: prompt });
//
//     // If detailed memory exceeds limit, summarize it
//     if (this.memory.length > this.maxDetailedMessages) {
//       await this.summarizeOldMemory();
//     }
//
//     // Combine summarized + detailed memory
//     const fullMemory: Message[] = [...this.summaryMemory, ...this.memory];
//
//     const response = await this.openai.chat.completions.create({
//       model: this.model,
//       messages: fullMemory,
//     });
//
//     const aiReply = response.choices[0]?.message?.content;
//
//     if (aiReply) {
//       // Add AI's reply to detailed memory
//       this.memory.push({ role: "assistant", content: aiReply });
//     }
//
//     console.log("AI Reply:", aiReply);
//
//     return aiReply || "";
//   }
// }

export class AiController {
  private openai: OpenAI;
  private model: string;
  private memory: Message[];
  private summary: string;
  private systemMessage: Message;
  private maxMemorySlots: number;
  //private importantFacts: { key: string; value: string }[] = [];

  constructor(options: AiControllerOptions = {}) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY!,
    });
    this.model = options.model || "gpt-4";

    this.systemMessage = {
      role: "system",
      content:
        "You are a professional real estate investor and advisor. You are very good at analyzing real estate deals and providing advice to investors.",
    };
    this.memory = [this.systemMessage];
    this.summary = "";
    this.maxMemorySlots = 22;
  }

  // addFact(key: string, value: string) {
  //   this.importantFacts.push({ key, value });
  // }

  async summarize(userPrompt: Message) {
    this.memory.push(userPrompt);
    this.memory = this.memory.slice(-this.maxMemorySlots);

    const summaryPrompt: string = `
      Summarize the following conversation briefly, preserving important context and critical facts like dollar value, dates, names, places, anything critical should always be included in the summary even if it gets somewhat long:
      ${this.memory
        .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
        .join("\n")}
      ${userPrompt.content}`;

    const summaryResponse = await this.openai.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You summarize conversations very concisely.",
        },
        { role: "user", content: summaryPrompt },
      ],
    });

    this.summary = summaryResponse.choices[0]?.message?.content || "";
  }

  async ask(userPrompt: string): Promise<string> {
    await this.summarize({ role: "user", content: userPrompt });

    //const messages: Message[] = [{ role: "user", content: this.summary }];

    const messages: Message[] = [
      {
        role: "system",
        content: `
          You have memory from the previous conversation summarized below. 
          However, you must answer ONLY the latest user question directly, 
          without restating the summary unless necessary. 
          Stay concise and relevant. Assume the user remembers the conversation history unless clarification is requested.
      `.trim(),
      },
      {
        role: "user",
        content: this.summary,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    console.log("AI Summary:", this.summary);

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages,
    });

    return response.choices[0]?.message?.content || "";
  }
}
