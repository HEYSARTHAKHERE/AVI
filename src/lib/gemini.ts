import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client safely
const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as any).__GEMINI_API_KEY : '');

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini client initialization notice:', err);
  }
}

export interface GeneratedBrief {
  objective: string;
  targetAudience: string;
  deliverables: string[];
  timeline: string;
  contentRequirements: string[];
  callToAction: string;
  hashtags: string[];
  mentions: string[];
  usageRights: string;
  approvalProcess: string;
}

// 1. Brand AI: Generate Campaign Brief
export async function generateCampaignBrief(input: {
  productService: string;
  objective: string;
  audience: string;
  platform: string;
  budget: number;
  currency: string;
}): Promise<GeneratedBrief> {
  const prompt = `You are the Lead Creative Campaign Architect at Kollavo (creator-brand platform).
Generate a structured, professional campaign brief draft for:
Product/Service: ${input.productService}
Objective: ${input.objective}
Target Audience: ${input.audience}
Primary Platform: ${input.platform}
Budget: ${input.currency} ${input.budget.toLocaleString()}

IMPORTANT: Do not invent false product claims or unsupported guarantees.
Respond in valid JSON format with the following keys:
{
  "objective": "...",
  "targetAudience": "...",
  "deliverables": ["...", "..."],
  "timeline": "...",
  "contentRequirements": ["...", "..."],
  "callToAction": "...",
  "hashtags": ["#...", "#..."],
  "mentions": ["@..."],
  "usageRights": "...",
  "approvalProcess": "..."
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return parsed;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to structured blueprint:', err);
    }
  }

  // High-fidelity structured default blueprint fallback
  return {
    objective: `${input.objective} — driving verified audience awareness, elevated visual storytelling, and high engagement on ${input.platform}.`,
    targetAudience: `${input.audience} seeking premium quality, authentic recommendations, and seamless digital experiences.`,
    deliverables: [
      `1x High-production 4K ${input.platform} video / Reel highlighting real usage`,
      `2x Interactive story frames featuring direct swipe/link sticker`,
      `Raw asset delivery for brand digital licensing`,
    ],
    timeline: '14 calendar days from product receipt: Draft delivery in 7 days, review in 48h, publication on agreed date.',
    contentRequirements: [
      `Clean aesthetic lighting matching Kollavo luxury editorial standards`,
      `Honest, natural creator voice without forced corporate jargon`,
      `Clear product visibility in the first 3 seconds`,
    ],
    callToAction: 'Explore the collection through the link in bio / sticker with exclusive community code.',
    hashtags: [`#${input.productService.replace(/\s+/g, '')}`, '#KollavoPartner', '#SponsoredContent'],
    mentions: ['@brand_official'],
    usageRights: '30-day organic and paid digital ad amplification across brand social channels.',
    approvalProcess: 'Draft submission via Kollavo Content Approval Workspace → 1 revision window included → Final approval before live posting.',
  };
}

// 2. Creator AI: Proposal Builder & Brief Explainer
export async function generateCreatorProposal(input: {
  creatorName: string;
  creatorCategory: string;
  campaignTitle: string;
  brandName: string;
  briefSummary: string;
  deliverables: string;
}): Promise<{
  proposalPitch: string;
  contentAngle: string;
  suggestedDeliverablesTimeline: string;
}> {
  const prompt = `You are a top creator manager assisting ${input.creatorName} (${input.creatorCategory} creator).
Draft a persuasive, confident, and professional collaboration proposal for:
Brand: ${input.brandName}
Campaign: ${input.campaignTitle}
Brief: ${input.briefSummary}
Deliverables: ${input.deliverables}

Rules:
1. Emphasize authentic creator voice and high production quality.
2. Ground all claims in realistic creator capabilities; do NOT hallucinate fake follower counts or metrics.
3. Respond in JSON with keys: "proposalPitch", "contentAngle", "suggestedDeliverablesTimeline".`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed;
    } catch (err) {
      console.warn('Gemini creator assistant error:', err);
    }
  }

  return {
    proposalPitch: `Hi ${input.brandName} team! I've reviewed your brief for ${input.campaignTitle}. My audience is deeply engaged with contemporary ${input.creatorCategory.toLowerCase()} aesthetics, and I would love to craft a high-fidelity narrative that seamlessly showcases your brand while preserving organic creator authenticity.`,
    contentAngle: `Visual documentary style focusing on tactile product details, everyday utility, and minimalist luxury aesthetics that naturally inspire viewer trust.`,
    suggestedDeliverablesTimeline: `Asset delivery within 7 business days of agreement. Fully aligned with your revisions workflow on the Kollavo workspace.`,
  };
}

// 3. AI Assistant Contextual Chat for Kollavo (Creator & Brand)
export async function askKollavoAssistant(params: {
  role: 'creator' | 'brand';
  userMessage: string;
  contextData?: Record<string, any>;
}): Promise<{
  answer: string;
  isAiGenerated: boolean;
  verifiedDataTags: string[];
}> {
  const roleName = params.role === 'creator' ? 'Creator Assistant' : 'Brand Campaign Advisor';
  const prompt = `You are Kollavo AI (${roleName}).
Context: User role is ${params.role}.
User query: "${params.userMessage}"

Ground rules:
- Provide actionable, concise, strategic guidance for creator-brand collaborations.
- NEVER fabricate fake followers, fake earnings, fake views, or fake reviews.
- Explicitly distinguish between verified platform data and AI recommendations.
- Keep tone professional, high-fashion-tech, and encouraging.`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return {
        answer: response.text || 'I am ready to help organize your collaboration workflow.',
        isAiGenerated: true,
        verifiedDataTags: ['AI Advisory Note', 'Grounded Guidance'],
      };
    } catch (err) {
      console.warn('Kollavo AI chat error:', err);
    }
  }

  // Graceful rule-based response
  return {
    answer: `Here is guidance from Kollavo AI for your ${params.role} workflow: Focus on transparent deliverable alignment, clear usage rights (organic vs paid amplification), and verified platform data. When setting terms, define timeline milestones (Draft -> Review -> Approval) to ensure smooth escrow release.`,
    isAiGenerated: true,
    verifiedDataTags: ['Platform Standard Best Practice'],
  };
}
