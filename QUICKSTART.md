# 🍽️ AI Meal Planner - Ready for Vercel Deployment

Your meal planner app is fully packaged and ready to deploy! Here's what you have:

## 📁 Project Structure

```
meal-planner-app/
├── pages/
│   ├── _app.js                        # App wrapper
│   ├── index.js                       # Main app (client-side API calls)
│   ├── index-secure.js                # Secure version (backend API calls)
│   └── api/
│       └── generate-meal-plan.js      # Secure backend API route
├── styles/
│   └── globals.css                    # Tailwind CSS
├── package.json                       # Dependencies
├── next.config.js                     # Next.js config
├── tailwind.config.js                 # Tailwind config
├── postcss.config.js                  # PostCSS config
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment variables template
├── deploy.sh                          # Quick deployment script
├── README.md                          # Full documentation
└── DEPLOYMENT.md                      # Detailed deployment guide
```

## 🚀 Quick Start - 3 Ways to Deploy

### Option 1: Fastest - Vercel CLI (5 minutes)

```bash
cd meal-planner-app

# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Deploy!
vercel

# Deploy to production
vercel --prod
```

### Option 2: Automated Script

```bash
cd meal-planner-app
./deploy.sh
```

The script will:
- Install dependencies
- Test the build
- Guide you through deployment
- Help with Git setup if needed

### Option 3: GitHub Integration

```bash
cd meal-planner-app
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Then go to vercel.com → Import Project → Select your repo → Deploy

## 🔐 Important: API Key Security

**Current setup:** The app calls Gemini API directly from the browser (NOT secure for production)

**📖 See GEMINI-API-SETUP.md for detailed instructions on getting and configuring your API key.**

**For production:**

1. **Add environment variable in Vercel:**
   ```bash
   vercel env add GEMINI_API_KEY
   # Enter your Gemini API key when prompted
   ```

2. **Use the secure version:**
   ```bash
   # In your project directory
   mv pages/index.js pages/index-original.js
   mv pages/index-secure.js pages/index.js
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

Now your API key is safe on the server!

## 📋 Pre-Deployment Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Build tested locally (`npm run build`)
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Have Gemini API key ready (get at https://aistudio.google.com/app/apikey)
- [ ] Decided on deployment method (CLI/GitHub/Script)

## 🎯 Post-Deployment Steps

1. **Test your deployment** - Visit the URL and generate a meal plan
2. **Set up custom domain** (optional) - In Vercel dashboard
3. **Monitor usage** - Check Vercel Analytics
4. **Secure API calls** - Switch to index-secure.js version

## 💡 Features Your App Includes

✅ AI-powered 7-day meal planning
✅ Global cuisine diversity (15+ cuisines)
✅ Customizable family size and ages
✅ Dietary preference support (7 options)
✅ Automatic shopping lists with quantities
✅ Recipe links to reputable sites
✅ Preparation time estimates
✅ Beautiful, responsive UI
✅ Mobile-friendly design

## 📚 Documentation

- **GEMINI-API-SETUP.md** - Complete guide to getting and configuring your Gemini API key
- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **.env.example** - Environment variables info

## 🛠️ Troubleshooting

**Build fails?**
```bash
npm run build
# Check error messages
```

**Can't deploy?**
```bash
vercel login
# Make sure you're logged in
```

**API errors?**
- Check API key is set correctly
- Verify you're using the secure version
- Check Vercel function logs

## 🎉 You're All Set!

Your meal planner is ready to deploy. Choose your preferred method above and you'll be live in minutes!

For detailed instructions, see:
- `README.md` for full documentation
- `DEPLOYMENT.md` for deployment guide

---

**Need help?** Check the Vercel docs at https://vercel.com/docs
