// ── Multi-Provider AI Engine (OpenAI + Ollama Compatibility) ────────────────

export type AIProvider = "OPENAI" | "OLLAMA";

export interface AIGenerateOptions {
  provider?: AIProvider;
  model?: string;
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
}

export class AIServiceProvider {
  private static openaiKey = process.env.OPENAI_API_KEY || "";
  private static ollamaEndpoint = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  /**
   * Dispatch prompt request to OpenAI or Ollama
   */
  static async generate(options: AIGenerateOptions): Promise<string> {
    const provider = options.provider || (this.openaiKey ? "OPENAI" : "OLLAMA");

    if (provider === "OPENAI" && this.openaiKey) {
      return await this.callOpenAI(options);
    } else {
      return await this.callOllama(options);
    }
  }

  private static async callOpenAI(options: AIGenerateOptions): Promise<string> {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.openaiKey}`,
        },
        body: JSON.stringify({
          model: options.model || "gpt-4o-mini",
          messages: [
            { role: "system", content: options.systemPrompt || "You are an expert social media AI architect." },
            { role: "user", content: options.prompt },
          ],
          temperature: options.temperature || 0.7,
        }),
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch {
      return this.fallbackMockResponse(options.prompt);
    }
  }

  private static async callOllama(options: AIGenerateOptions): Promise<string> {
    try {
      const res = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: options.model || "llama3",
          prompt: `${options.systemPrompt ? options.systemPrompt + "\n\n" : ""}${options.prompt}`,
          stream: false,
        }),
      });

      const data = await res.json();
      return data.response || "";
    } catch {
      return this.fallbackMockResponse(options.prompt);
    }
  }

  private static fallbackMockResponse(prompt: string): string {
    return `[AI Generated Response] Structured analysis for prompt: "${prompt.slice(0, 40)}..."`;
  }
}
