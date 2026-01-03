# AI Meal Planner

A beautiful, AI-powered meal planning application built with Next.js, React, and Google Gemini AI. Generate weekly meal plans with diverse global cuisines, preparation times, recipes, and automated shopping lists.

## Features

- 🍽️ **AI-Powered Meal Planning**: Generate personalized 7-day meal plans using Google Gemini AI
- 🌍 **Global Cuisines**: Diverse meal options from Chinese, Indian, Thai, Japanese, Korean, Mexican, Mediterranean, and more
- 👨‍👩‍👧‍👦 **Family-Friendly**: Customize for family size and ages
- 🥗 **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, dairy-free, low-carb, and keto diets
- 📋 **Smart Shopping Lists**: Automatically generated grocery lists with quantities organized by category
- 🔗 **Recipe Links**: Direct links to detailed recipes from reputable cooking websites
- ⏱️ **Preparation Times**: Realistic time estimates for each meal

## Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18, Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini 2.0 Flash

## Important: API Key Security

⚠️ **The current implementation calls the Gemini API directly from the browser, which is NOT secure for production use.**

For production deployment, you should:

1. Create a backend API route to proxy API calls
2. Store your Gemini API key in environment variables on the server
3. Never expose your API key in client-side code

### Example Backend API Route

Create `/pages/api/generate-meal-plan.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, maxOutputTokens, temperature } = req.body;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: temperature || 0.7,
          maxOutputTokens: maxOutputTokens || 4000,
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
}
```

Then update your client code to call `/api/generate-meal-plan` instead of the Gemini API directly.

## Local Development

### Prerequisites

- Node.js 18+ and npm/yarn
- Gemini API key (get one at https://aistudio.google.com/app/apikey)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from the project directory**:
```bash
cd meal-planner-app
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - What's your project's name? meal-planner-app
   - In which directory is your code located? ./
   - Want to override the settings? No

5. **Set environment variables** (if using backend API route):
```bash
vercel env add GEMINI_API_KEY
```

6. **Deploy to production**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project settings (usually auto-detected for Next.js)
   - Add environment variables if needed
   - Click "Deploy"

### Option 3: Deploy with Vercel GitHub Integration

1. Connect your GitHub account to Vercel
2. Push your code to GitHub
3. Vercel will automatically detect the push and deploy
4. Every subsequent push to main branch will trigger a new deployment

## Environment Variables

If implementing the secure backend API route:

```bash
GEMINI_API_KEY=your_api_key_here
```

Add this in:
- Vercel Dashboard: Project Settings → Environment Variables
- Vercel CLI: `vercel env add GEMINI_API_KEY`

## Project Structure

```
meal-planner-app/
├── pages/
│   ├── _app.js           # App wrapper with global styles
│   ├── index.js          # Main meal planner component
│   └── api/              # (Optional) Backend API routes
├── styles/
│   └── globals.css       # Global styles with Tailwind
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## Customization

### Modify Dietary Options
Edit the dietary preferences dropdown in `pages/index.js`:
```javascript
<select value={formData.dietary} ...>
  <option value="none">No restrictions</option>
  <option value="vegetarian">Vegetarian</option>
  // Add more options here
</select>
```

### Adjust AI Prompt
Modify the prompt in the `generateMealPlan` function to customize meal plan generation.

### Change Styling
Update colors and styling in:
- `tailwind.config.js` for theme colors
- Component classes in `pages/index.js`

## Performance Optimization

For better performance in production:

1. **Enable caching**: Implement caching for similar meal plan requests
2. **Optimize API calls**: Batch requests or implement rate limiting
3. **Image optimization**: If adding images, use Next.js Image component
4. **Code splitting**: Next.js handles this automatically

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf .next` then `npm run dev`

### API Errors
- Verify your Anthropic API key is valid
- Check API rate limits
- Ensure proper error handling in API calls

### Styling Issues
- Verify Tailwind CSS is properly configured
- Check that `globals.css` imports are correct
- Ensure PostCSS is configured

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Gemini API docs](https://ai.google.dev/docs)
- Open an issue in the repository
