import { AIServiceProvider, AIProvider } from "./provider";

export interface MultiChannelAIMetadata {
  youtube: { title: string; description: string; tags: string[] };
  instagram: { caption: string; hashtags: string[] };
  tiktok: { caption: string; keywords: string[] };
  linkedin: { post: string };
}

export class AIServices {
  /**
   * Caption Generator
   */
  static async generateCaption(topic: string, platform: string = "Instagram", tone: string = "engaging", provider?: AIProvider): Promise<string> {
    return await AIServiceProvider.generate({
      provider,
      systemPrompt: `Generate a high-converting ${platform} caption in a ${tone} tone. Include a compelling hook and call-to-action.`,
      prompt: `Topic / Summary: ${topic}`,
    });
  }

  /**
   * Title Generator
   */
  static async generateTitle(topic: string, platform: string = "YouTube", provider?: AIProvider): Promise<string> {
    return await AIServiceProvider.generate({
      provider,
      systemPrompt: `Generate 3 viral, high-CTR titles for ${platform}. Output only the best title.`,
      prompt: `Topic: ${topic}`,
    });
  }

  /**
   * Hashtag & SEO Generator
   */
  static async generateHashtags(topic: string, count: number = 10, provider?: AIProvider): Promise<string[]> {
    const raw = await AIServiceProvider.generate({
      provider,
      systemPrompt: `Generate ${count} trending, high-reach hashtags for social media. Output comma-separated hashtags starting with #.`,
      prompt: `Topic: ${topic}`,
    });
    return raw.split(/[\s,]+/).filter((t) => t.startsWith("#"));
  }

  /**
   * Translation Service
   */
  static async translateText(text: string, targetLanguage: string, provider?: AIProvider): Promise<string> {
    return await AIServiceProvider.generate({
      provider,
      systemPrompt: `Translate the text accurately into ${targetLanguage}. Maintain tone, formatting, and emojis.`,
      prompt: text,
    });
  }

  /**
   * Tone Rewrite Service
   */
  static async rewriteTone(text: string, desiredTone: string, provider?: AIProvider): Promise<string> {
    return await AIServiceProvider.generate({
      provider,
      systemPrompt: `Rewrite the content into a ${desiredTone} tone while preserving key information.`,
      prompt: text,
    });
  }

  /**
   * Complete Multi-Platform SEO & Metadata Generator
   */
  static async generateFullPackage(transcript: string, brandVoice: string = "Professional"): Promise<MultiChannelAIMetadata> {
    const title = await this.generateTitle(transcript, "YouTube");
    const hashtags = await this.generateHashtags(transcript, 8);

    return {
      youtube: {
        title: title || "Enterprise AI Content OS Blueprint",
        description: `${transcript.slice(0, 250)}...\n\n🔔 Subscribe for more automated content distribution strategies!`,
        tags: ["#AI", "#SaaS", "#Automation", "#Growth", "#Tech"],
      },
      instagram: {
        caption: `🚀 ${transcript.slice(0, 180)}...\n\nDrop a comment below with your thoughts! 👇`,
        hashtags: hashtags.length > 0 ? hashtags : ["#AI", "#ContentOS", "#Reels", "#Automation"],
      },
      tiktok: {
        caption: `Zero manual editing pipeline demo! 🔥 ${transcript.slice(0, 100)}`,
        keywords: ["AI automation", "Content OS", "Viral shorts"],
      },
      linkedin: {
        post: `Automating enterprise content distribution pipelines with AI.\n\n${transcript}\n\nKey takeaways:\n1. Autonomous ingestion\n2. AI metadata generation\n3. Timezone-aware publishing`,
      },
    };
  }
}
