# 🔑 Setting Up Your Gemini API Key

This guide shows you how to get and configure your Google Gemini API key for the AI Meal Planner.

## Getting Your Gemini API Key

### Step 1: Get API Key from Google AI Studio

1. Go to **Google AI Studio**: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Get API key"** or **"Create API key"**
4. Select a Google Cloud project (or create a new one)
5. Copy your API key - it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

⚠️ **Important**: Keep this key secure! Never share it publicly or commit it to Git.

## Configuration Methods

You have two options for using your API key:

### Option A: Quick Test (Client-Side - NOT for Production)

For local testing only:

1. Open `pages/index.js`
2. Find this line:
   ```javascript
   const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + 'YOUR_GEMINI_API_KEY', {
   ```
3. Replace `'YOUR_GEMINI_API_KEY'` with your actual API key:
   ```javascript
   const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', {
   ```
4. Do the same for the second API call in the `sendEmailReminders` function

**⚠️ WARNING**: This exposes your API key in the browser. Only use for local testing!

### Option B: Secure Production Setup (Recommended)

For production deployment with Vercel:

1. **Use the secure version of the code:**
   ```bash
   mv pages/index.js pages/index-original.js
   mv pages/index-secure.js pages/index.js
   ```

2. **Set environment variable in Vercel:**
   
   **Via Vercel CLI:**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your API key when prompted
   # Select: Production, Preview, Development
   ```
   
   **Via Vercel Dashboard:**
   - Go to your project on vercel.com
   - Click **Settings** → **Environment Variables**
   - Click **Add**
   - Name: `GEMINI_API_KEY`
   - Value: Your API key (paste it)
   - Select all environments: Production, Preview, Development
   - Click **Save**

3. **Deploy or redeploy:**
   ```bash
   vercel --prod
   ```

Now your API key is stored securely on Vercel's servers and never exposed to the browser!

## Testing Your API Key

### Test Locally

```bash
cd meal-planner-app
npm run dev
```

Open http://localhost:3000 and try generating a meal plan.

### Test on Vercel

After deployment, visit your Vercel URL and test the meal plan generation.

## Troubleshooting

### Error: "API key not valid"
- Double-check you copied the entire API key
- Make sure there are no extra spaces
- Verify the key is enabled in Google Cloud Console

### Error: "Quota exceeded"
- Gemini has free tier limits
- Check your usage at https://aistudio.google.com/
- Consider upgrading to a paid plan if needed

### API calls not working in production
- Verify environment variable is set in Vercel
- Check you're using `pages/index-secure.js` (renamed to `index.js`)
- Check Vercel function logs for errors

### Still seeing "YOUR_GEMINI_API_KEY" error
- Make sure you replaced the placeholder text with your actual key
- If using secure version, ensure environment variable is set

## API Key Best Practices

✅ **DO:**
- Store in environment variables for production
- Use `.env.local` for local development (gitignored)
- Rotate keys periodically
- Monitor usage in Google AI Studio

❌ **DON'T:**
- Commit API keys to Git
- Share keys publicly
- Use the same key for multiple projects
- Expose keys in client-side code

## Free Tier Limits

Google Gemini 2.0 Flash free tier includes:
- 15 RPM (requests per minute)
- 1 million TPM (tokens per minute)
- 1,500 RPD (requests per day)

Monitor your usage at: https://aistudio.google.com/app/apikey

## Getting Help

If you're having issues:
1. Check the [Gemini API documentation](https://ai.google.dev/docs)
2. Review your Google Cloud project settings
3. Check Vercel deployment logs
4. Verify environment variables are set correctly

---

**Quick Reference:**

- Get API Key: https://aistudio.google.com/app/apikey
- Gemini Docs: https://ai.google.dev/docs
- Vercel Env Vars: Project Settings → Environment Variables
