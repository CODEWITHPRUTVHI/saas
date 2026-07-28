import { z } from "zod";

// ─── Supported Languages ─────────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
  ar: "Arabic",
  hi: "Hindi",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// ─── Translation Output Schema ────────────────────────────────────────────────
export const TranslationResultSchema = z.object({
  language: z.string(),
  languageName: z.string(),
  title: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()),
  confidenceFlag: z.enum(["auto", "needs_review"]),
  reviewReasons: z.array(z.string()).optional(),
});

export type TranslationResult = z.infer<typeof TranslationResultSchema>;

export const BatchTranslationOutputSchema = z.record(z.string(), TranslationResultSchema);
export type BatchTranslationOutput = z.infer<typeof BatchTranslationOutputSchema>;

// ─── Input Contract (from Section 6.2) ───────────────────────────────────────
export interface TranslationInput {
  sourceText: {
    title: string;
    caption: string;
    hashtags: string[];
  };
  sourceLanguage?: LanguageCode;
  targetLanguages: LanguageCode[];
  brandName?: string;
  brandVoiceProfile?: string;
}

// ─── Idiom / Risk Phrase Detector ────────────────────────────────────────────
const REVIEW_TRIGGERS = [
  /\b(vs\.?|versus|beats|crush|kill it|dominate|disrupt|blow up|fire)\b/gi,
  /\b\d+[xX%]\b/g,     // Numbers with units/multipliers
  /\b(literally|actually|basically|honestly|lowkey|vibe)\b/gi, // English idioms
  /[$€£¥₹]\d+/g,       // Currency values
];

function detectReviewTriggers(text: string): string[] {
  const reasons: string[] = [];
  REVIEW_TRIGGERS.forEach((pattern, idx) => {
    if (pattern.test(text)) {
      const labels = ["idiomatic expression", "numeric/unit value", "colloquialism", "currency reference"];
      reasons.push(labels[idx] ?? "flagged pattern");
    }
  });
  return reasons;
}

// ─── Translation Engine ────────────────────────────────────────────────────────
export async function translateContent(input: TranslationInput): Promise<BatchTranslationOutput> {
  const { sourceText, targetLanguages, brandName = "", brandVoiceProfile = "" } = input;

  const results: BatchTranslationOutput = {};

  // Detect any review triggers in the source text
  const sourceTriggers = detectReviewTriggers(
    [sourceText.title, sourceText.caption, ...sourceText.hashtags].join(" ")
  );
  const baseNeedsReview = sourceTriggers.length > 0;

  // Translation map — deterministic, structured outputs that simulate real LLM translation
  // In production, each of these would be a structured Claude API call with per-language system prompts
  const translationData: Record<string, { title: string; caption: string; hashtags: string[] }> = {
    es: {
      title: `${sourceText.title.replace(/\[.*?\]/g, "").trim()} | Sistema de Distribución IA`,
      caption: `¡Descubre cómo automatizar la distribución de contenido entre plataformas con carpetas supervisadas e IA! ${brandName ? `Impulsado por ${brandName}.` : ""} Publica en YouTube, Instagram y TikTok sin intervención manual. 🚀`,
      hashtags: ["#Automatización", "#MarketingDigital", "#IA", "#Reels", "#Crecimiento"],
    },
    fr: {
      title: `${sourceText.title.replace(/\[.*?\]/g, "").trim()} | Système de Distribution IA`,
      caption: `Découvrez comment automatiser la distribution de contenu sur toutes les plateformes avec des dossiers surveillés et l'IA. ${brandName ? `Propulsé par ${brandName}.` : ""} 🚀`,
      hashtags: ["#Automatisation", "#MarketingNumérique", "#IA", "#Innovation", "#Croissance"],
    },
    de: {
      title: `${sourceText.title.replace(/\[.*?\]/g, "").trim()} | KI-Verteilungssystem`,
      caption: `Erfahren Sie, wie Sie die Inhaltsverteilung über Plattformen hinweg mit überwachten Ordnern und KI automatisieren können. ${brandName ? `Entwickelt von ${brandName}.` : ""} 🚀`,
      hashtags: ["#Automatisierung", "#DigitalesMarketing", "#KünstlicheIntelligenz", "#Innovation"],
    },
    pt: {
      title: `${sourceText.title.replace(/\[.*?\]/g, "").trim()} | Sistema de Distribuição com IA`,
      caption: `Descubra como automatizar a distribuição de conteúdo entre plataformas com pastas monitoradas e IA! ${brandName ? `Desenvolvido por ${brandName}.` : ""} 🚀`,
      hashtags: ["#Automação", "#MarketingDigital", "#IA", "#Crescimento", "#Inovação"],
    },
    ja: {
      title: `${sourceText.title.split(":")[0].trim()} | AIコンテンツ配信システム`,
      caption: `AIと監視フォルダを使用して、複数のプラットフォームにわたるコンテンツ配信を自動化する方法をご紹介します。${brandName ? ` ${brandName}による提供。` : ""} 🚀`,
      hashtags: ["#AI", "#自動化", "#デジタルマーケティング", "#テクノロジー", "#成長"],
    },
    zh: {
      title: `${sourceText.title.split(":")[0].trim()} | AI内容分发系统`,
      caption: `了解如何通过监控文件夹和AI自动化跨平台内容分发。${brandName ? `由${brandName}提供支持。` : ""} 🚀`,
      hashtags: ["#人工智能", "#内容自动化", "#数字营销", "#科技", "#增长"],
    },
    ar: {
      title: `${sourceText.title.split(":")[0].trim()} | نظام توزيع المحتوى بالذكاء الاصطناعي`,
      caption: `اكتشف كيف تقوم بأتمتة توزيع المحتوى عبر المنصات باستخدام المجلدات المراقبة والذكاء الاصطناعي. ${brandName ? `مقدم من ${brandName}.` : ""} 🚀`,
      hashtags: ["#ذكاء_اصطناعي", "#أتمتة", "#تسويق_رقمي", "#ابتكار", "#نمو"],
    },
    hi: {
      title: `${sourceText.title.split(":")[0].trim()} | AI कंटेंट वितरण प्रणाली`,
      caption: `जानें कि कैसे निगरानी किए गए फ़ोल्डर और AI के साथ प्लेटफ़ॉर्म पर कंटेंट वितरण को स्वचालित करें। ${brandName ? `${brandName} द्वारा संचालित।` : ""} 🚀`,
      hashtags: ["#स्वचालन", "#डिजिटलमार्केटिंग", "#AI", "#इनोवेशन", "#विकास"],
    },
  };

  for (const langCode of targetLanguages) {
    const translation = translationData[langCode];
    if (!translation) continue;

    const reviewReasons = [...sourceTriggers];

    // Additional language-specific review flags
    if (langCode === "ar" || langCode === "ja" || langCode === "zh") {
      reviewReasons.push("right-to-left or CJK script — verify formatting in target platform UI");
    }

    const confidenceFlag: "auto" | "needs_review" = (baseNeedsReview || reviewReasons.length > 0)
      ? "needs_review"
      : "auto";

    const result = TranslationResultSchema.parse({
      language: langCode,
      languageName: SUPPORTED_LANGUAGES[langCode as LanguageCode] ?? langCode,
      title: translation.title,
      caption: translation.caption,
      hashtags: translation.hashtags,
      confidenceFlag,
      reviewReasons: reviewReasons.length > 0 ? reviewReasons : undefined,
    });

    results[langCode] = result;
  }

  return results;
}
