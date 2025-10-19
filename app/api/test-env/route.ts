export const runtime = 'nodejs';           // force Node (not Edge)
export const dynamic = 'force-dynamic';    // no caching

export async function GET() {
  const found = !!process.env.DATABASE_URL;
  return new Response(JSON.stringify({ DATABASE_URL: found ? 'found' : 'missing' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
