export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const token = url.pathname.split('/').pop();
  const resp = await fetch(
    `https://smwmkeoljqnifaoqzemb.supabase.co/functions/v1/shared-moment/${token}`
  );
  const html = await resp.text();
  return new Response(html, {
    status: resp.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
