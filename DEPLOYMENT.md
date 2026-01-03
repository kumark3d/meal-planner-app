# Deployment Guide for Vercel

This guide walks you through deploying your AI Meal Planner to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git installed on your machine
- Your project code ready

## Method 1: Deploy via Vercel CLI (Quickest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to your project
```bash
cd meal-planner-app
```

### Step 3: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

### Step 4: Deploy
```bash
vercel
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account/team
- **Link to existing project?** No
- **What's your project's name?** meal-planner-app (or your preferred name)
- **In which directory is your code located?** ./ (press Enter)
- **Want to override the settings?** No (press Enter)

This creates a preview deployment. Your app will be live at a preview URL.

### Step 5: Deploy to Production
```bash
vercel --prod
```

### Step 6: (Optional) Set Environment Variables
If you're using the secure backend API route:
```bash
vercel env add GEMINI_API_KEY
```
Select "Production" when asked which environment.

Then redeploy:
```bash
vercel --prod
```

## Method 2: Deploy via GitHub Integration

### Step 1: Create a GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Meal Planner"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/meal-planner.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure (if needed)
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: ./ (default)
- **Build Command**: `next build` (auto-detected)
- **Output Directory**: .next (auto-detected)

### Step 4: Add Environment Variables
If using the secure backend API:
1. Click "Environment Variables"
2. Add: `GEMINI_API_KEY` = your_api_key_here
3. Select all environments (Production, Preview, Development)

### Step 5: Deploy
Click "Deploy" and wait for the build to complete.

### Step 6: Automatic Deployments
From now on, every push to your main branch will automatically deploy to Vercel!

## Method 3: Deploy from Local Directory (No Git)

### Step 1: Use Vercel CLI
```bash
cd meal-planner-app
vercel
```

This will deploy without needing Git.

## Post-Deployment Steps

### 1. Test Your Deployment
Visit your deployment URL and test:
- Form inputs work correctly
- Meal plan generation functions
- Styling appears correctly
- Shopping list displays properly

### 2. Set Up Custom Domain (Optional)
In Vercel Dashboard:
1. Go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 3. Configure Environment Variables
For production use with secure API:
1. In Vercel Dashboard: Project → Settings → Environment Variables
2. Add `GEMINI_API_KEY`
3. Redeploy or wait for automatic deployment

### 4. Monitor Performance
Check Vercel Analytics:
- Visit counts
- Response times
- Error rates

## Updating Your Deployment

### With GitHub Integration:
```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push
```
Vercel automatically deploys changes.

### With Vercel CLI:
```bash
# Make changes, then:
vercel --prod
```

## Troubleshooting

### Build Fails
1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in package.json
3. Test locally: `npm run build`

### API Errors in Production
1. Verify environment variables are set correctly
2. Check API key is valid
3. Review function logs in Vercel Dashboard

### Styling Issues
1. Ensure Tailwind CSS config is correct
2. Check that globals.css is imported in _app.js
3. Clear browser cache

### Environment Variables Not Working
1. Ensure they're set in correct environment (Production/Preview/Development)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

## Security Checklist

- [ ] Gemini API key stored in environment variables (not in code)
- [ ] Using backend API route (not direct client-side calls)
- [ ] .env files are in .gitignore
- [ ] API routes validate incoming requests
- [ ] Rate limiting implemented (if needed)

## Recommended Next Steps

1. **Set up monitoring**: Use Vercel Analytics or integrate with services like Sentry
2. **Add analytics**: Track user behavior with Google Analytics or similar
3. **Implement caching**: Cache meal plans to reduce API costs
4. **Add user authentication**: If building a multi-user app
5. **Database integration**: Store user preferences and meal plans

## Cost Optimization

1. **Monitor API usage**: Track Gemini API calls
2. **Implement caching**: Reduce duplicate requests
3. **Set usage limits**: Add rate limiting per user
4. **Use preview deployments**: Test changes before production

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Documentation: https://nextjs.org/docs
- Gemini API Docs: https://ai.google.dev/docs

## Quick Reference Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Add environment variable
vercel env add [VARIABLE_NAME]

# Pull environment variables locally
vercel env pull
```

---

Your AI Meal Planner should now be live on Vercel! 🎉
