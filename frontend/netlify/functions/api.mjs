export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL
  if (!appsScriptUrl) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Missing env APPS_SCRIPT_URL' })
    }
  }

  try {
    const upstream = new URL(appsScriptUrl)

    const params = event.queryStringParameters || {}
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) upstream.searchParams.set(key, String(value))
    }

    const resp = await fetch(upstream.toString(), { method: 'GET' })
    const text = await resp.text()

    return {
      statusCode: resp.status,
      headers: {
        ...corsHeaders,
        'Content-Type': resp.headers.get('content-type') || 'application/json'
      },
      body: text
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: String(err) })
    }
  }
}
