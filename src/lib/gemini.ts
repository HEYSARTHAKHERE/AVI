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
  try {
    const res = await fetch('/api/ai/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.brief) {
        return data.brief;
      }
    }
  } catch (err) {
    console.warn('Server AI brief fetch error, using structured blueprint:', err);
  }

  // Authoritative structured default blueprint fallback
  return {
    objective: `${input.objective} — driving verified audience awareness, elevated visual storytelling, and high engagement on ${input.platform}.`,
    targetAudience: `${input.audience} seeking premium quality, authentic recommendations, and seamless digital experiences.`,
    deliverables: [
      `1x High-production 4K ${input.platform} video / Reel highlighting genuine craftsmanship`,
      `2x Interactive story frames featuring direct swipe/link sticker`,
      `Raw asset delivery for brand digital licensing`,
    ],
    timeline: '14 calendar days from product receipt: Draft delivery in 7 days, review in 48h, publication on agreed date.',
    contentRequirements: [
      `Clean aesthetic lighting matching MAVORA luxury editorial standards`,
      `Honest, natural creator voice without forced corporate jargon`,
      `Clear product visibility in the first 3 seconds`,
    ],
    callToAction: 'Explore the collection through the link in bio / sticker with exclusive community code.',
    hashtags: [`#${(input.productService || 'Campaign').replace(/\s+/g, '')}`, '#MAVORAPartner', '#SponsoredContent'],
    mentions: ['@brand_official'],
    usageRights: '30-day organic and paid digital ad amplification across brand social channels.',
    approvalProcess: 'Draft submission via MAVORA Content Approval Workspace → 1 revision window included → Final approval before live posting.',
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
  return {
    proposalPitch: `Hi ${input.brandName} team! I've reviewed your brief for ${input.campaignTitle}. My audience is deeply engaged with contemporary ${input.creatorCategory.toLowerCase()} aesthetics, and I would love to craft a high-fidelity narrative that seamlessly showcases your brand while preserving organic creator authenticity.`,
    contentAngle: `Visual documentary style focusing on tactile product details, everyday utility, and minimalist luxury aesthetics that naturally inspire viewer trust.`,
    suggestedDeliverablesTimeline: `Asset delivery within 7 business days of agreement. Fully aligned with your revisions workflow on the MAVORA workspace.`,
  };
}

// 3. AI Assistant Contextual Chat for MAVORA (Creator & Brand)
export async function askMAVORAAssistant(params: {
  role: 'creator' | 'brand';
  userMessage: string;
  contextData?: Record<string, any>;
}): Promise<{
  answer: string;
  isAiGenerated: boolean;
  verifiedDataTags: string[];
}> {
  try {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.answer) {
        return {
          answer: data.answer,
          isAiGenerated: true,
          verifiedDataTags: data.verifiedDataTags || ['AI Advisory Note · Distinct from Verified Platform Data'],
        };
      }
    }
  } catch (err) {
    console.warn('Server AI assistant fetch error, using structured response:', err);
  }

  // Graceful rule-based response
  return {
    answer: `Here is strategic guidance for your ${params.role} workflow: Establish clear deliverable acceptance criteria (draft, revisions window, final approval), specify usage rights (organic vs paid ad amplification), and verify that all funds remain in MAVORA Escrow until final asset sign-off.`,
    isAiGenerated: true,
    verifiedDataTags: ['Platform Standard Best Practice · AI Advisory Note'],
  };
}
