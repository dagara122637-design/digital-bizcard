import { next } from '@vercel/edge';

export const config = { matcher: '/card/:slug*' };

// 카카오톡 등 미리보기 크롤러
const BOT_UA = /kakaotalk-scrap|facebookexternalhit|twitterbot|slackbot|telegrambot|discordbot|linkedinbot|whatsapp|daumoa|googlebot/i;

export default async function middleware(req) {
  const ua = req.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return next();

  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  let data = {};
  try {
    const res = await fetch(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/cards?slug=eq.${slug}&select=data`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );
    const rows = await res.json();
    data = rows?.[0]?.data || {};
  } catch (_) {}

  const esc = (s = '') =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  const title = esc(data.companyName || '디지털 명함');
  const desc  = esc(data.description || data.tagline || '명함을 확인해보세요');
  const image = url.origin + '/og-v2.PNG';   // ⬅️ 방금 넣은 공통 이미지

  const html = `<!DOCTYPE html><html lang="ko"><head>
<meta charset="utf-8"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:image" content="${image}"/>
<meta property="og:url" content="${esc(req.url)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<title>${title}</title>
</head><body></body></html>`;

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}