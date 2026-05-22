export async function onRequest(context) {
  const { request, env } = context;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  try {
    const { name, email, message } = await request.json()
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400, headers })
    }

    console.log('[FEEDBACK]', { name, email, message, timestamp: new Date().toISOString() })

    return new Response(JSON.stringify({ success: true }), { status: 200, headers })
  } catch (err) {
    console.error('submit-feedback error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers })
  }
}