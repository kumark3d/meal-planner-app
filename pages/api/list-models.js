export default async function handler(req, res) {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not set' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: 'Failed to list models', details: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

3. **Commit the file**

4. **Wait for Vercel to deploy**

5. **Visit this URL in your browser:**
```
   https://your-app-url.vercel.app/api/list-models
