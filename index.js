// ═══════════════════════════════════════════════════════
// YAREUU AI - Cloudflare Worker CORS Proxy
// Deploy: https://workers.cloudflare.com (gratis)
// Cara deploy:
//   1. Buka dash.cloudflare.com → Workers & Pages → Create
//   2. Paste kode ini → Save & Deploy
//   3. Copy URL worker, isi di ai-chat.html bagian WORKER_URL
// ═══════════════════════════════════════════════════════

const API_BASE = 'https://api.zenitsu.web.id/api/ai/gpt';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const question = url.searchParams.get('question') || '';
    const prompt   = url.searchParams.get('prompt') || '';

    if (!question) {
      return new Response(JSON.stringify({ error: 'Missing question param' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    const apiUrl = `${API_BASE}?question=${encodeURIComponent(question)}&prompt=${encodeURIComponent(prompt)}`;

    try {
      const resp = await fetch(apiUrl, {
        headers: { 'User-Agent': 'YAREUU-AI-Worker/1.0' }
      });

      if (!resp.ok) {
        return new Response(JSON.stringify({ error: 'API error', status: resp.status }), {
          status: resp.status,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }
};