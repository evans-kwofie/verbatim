export const prerender = false;

import type { APIRoute } from 'astro';

const STAGE_LABELS: Record<string, string> = {
  'stage-1': 'Proposal stage — shaping the question',
  'stage-2': 'First draft — structure exists, needs refinement',
  'stage-3': 'Revision — feedback received, path unclear',
  'stage-4': 'Stalled — significant work done, momentum lost',
};

const TIER_LABELS: Record<string, string> = {
  'structural-review': 'Structural Review',
  'architecture': 'Architecture',
  'full-articulation': 'Full Articulation',
};

const ALLOWED_ORIGINS = [
  'https://verbatim.ink',
  'https://www.verbatim.ink',
  "https://useverbatim.vercel.app"
];

if (import.meta.env.DEV) {
  ALLOWED_ORIGINS.push('http://localhost:4321', 'http://localhost:3000');
}

export const POST: APIRoute = async ({ request }) => {
  // Origin check
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const webhookUrl = import.meta.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Slack webhook not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await request.json();

  // Honeypot check — if filled, it's a bot
  if (data.website) {
    // Return 200 so bots think it worked
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slackMessage = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `New Briefing from ${data.name || 'Unknown'}`,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Academic Level:*\n${data.degreeType || '—'}` },
          { type: 'mrkdwn', text: `*Type of Work:*\n${data.workType || '—'}` },
          { type: 'mrkdwn', text: `*Field of Study:*\n${data.field || '—'}` },
          { type: 'mrkdwn', text: `*University:*\n${data.university || '—'}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Writing Stage:*\n${STAGE_LABELS[data.writingStage] || data.writingStage || '—'}` },
          { type: 'mrkdwn', text: `*Target Completion:*\n${data.deadline || '—'}` },
        ],
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Service Tier:*\n${TIER_LABELS[data.serviceTier] || data.serviceTier || '—'}` },
        ],
      },
      { type: 'divider' },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Phone:*\n${data.phone || '—'}` },
          { type: 'mrkdwn', text: `*Email:*\n${data.email || '—'}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Brief:*\n${data.brief || '—'}`,
        },
      },
    ],
  };

  const slackResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackMessage),
  });

  if (!slackResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send to Slack' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
