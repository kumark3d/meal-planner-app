export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Server configuration error: API key not set' 
    });
  }

  try {
    const { prompt, maxOutputTokens, temperature } = req.body;

    // Validate request body
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Invalid request: prompt required' 
      });
    }

    // Call Gemini API with server-side API key
    //const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      //const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature || 0.7,
          maxOutputTokens: maxOutputTokens || 4000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ 
        error: 'API request failed', 
        details: errorData 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in meal plan generation:', error);
    return res.status(500).json({ 
      error: 'Failed to generate meal plan',
      message: error.message 
    });
  }
}
