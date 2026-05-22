export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers })

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  try {
    const { question, category } = await req.json()

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), { status: 400, headers })
    }

    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({
        answer: `**AI Career Counsellor**\n\nI'd be happy to answer: *"${question}"*\n\nTo enable AI-powered career advice, please add your **Groq API key** in the Netlify dashboard:\n1. Go to **Site settings → Environment variables**\n2. Add \`GROQ_API_KEY\` with your key from https://console.groq.com\n3. Redeploy the site\n\nOnce configured, you'll get personalized AI-generated answers for every question!`
      }), { status: 200, headers })
    }

    const messages = [
      {
        role: 'system',
        content: 'You are an expert IT career counsellor for BSc IT students in India. Provide clear, practical, and encouraging advice. Keep answers concise (2-4 paragraphs). Use simple language. Be specific about skills, salaries, companies, and next steps. Do not mention that you are an AI.'
      },
      {
        role: 'user',
        content: `Category: ${category || 'General'}\nQuestion: ${question}`
      }
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq API error:', err)
      return new Response(JSON.stringify({ error: 'AI service error' }), { status: 502, headers })
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer at this time.'

    return new Response(JSON.stringify({ answer }), { status: 200, headers })

  } catch (err) {
    console.error('ask-ai error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers })
  }
}
