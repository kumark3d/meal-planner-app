#!/bin/bash

# AI Meal Planner - Quick Deployment Script for Vercel
# This script helps you deploy your meal planner app quickly

echo "🍽️  AI Meal Planner - Vercel Deployment Helper"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the meal-planner-app directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

echo "🔧 Step 2: Testing local build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful"
echo ""

echo "🚀 Step 3: Ready to deploy!"
echo ""
echo "Choose your deployment method:"
echo "1) Deploy with Vercel CLI (recommended)"
echo "2) Setup for GitHub deployment"
echo "3) Exit"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Installing Vercel CLI..."
        npm install -g vercel
        
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo "You'll be prompted to:"
        echo "  - Login to Vercel (if not already logged in)"
        echo "  - Configure your project"
        echo ""
        
        vercel
        
        echo ""
        echo "✅ Preview deployment complete!"
        echo ""
        read -p "Deploy to production? (y/n): " prod_choice
        
        if [ "$prod_choice" = "y" ] || [ "$prod_choice" = "Y" ]; then
            vercel --prod
            echo ""
            echo "🎉 Production deployment complete!"
        fi
        
        echo ""
        echo "📝 Next steps:"
        echo "1. Set environment variable: vercel env add GEMINI_API_KEY"
        echo "2. Replace pages/index.js with pages/index-secure.js for secure API calls"
        echo "3. Redeploy: vercel --prod"
        ;;
        
    2)
        echo ""
        echo "Setting up Git repository..."
        
        if [ -d ".git" ]; then
            echo "Git repository already initialized"
        else
            git init
            echo "✅ Git repository initialized"
        fi
        
        git add .
        git commit -m "Initial commit: AI Meal Planner"
        
        echo ""
        echo "📝 Next steps:"
        echo "1. Create a new repository on GitHub"
        echo "2. Run: git remote add origin YOUR_GITHUB_REPO_URL"
        echo "3. Run: git push -u origin main"
        echo "4. Go to vercel.com and import your GitHub repository"
        echo "5. Add GEMINI_API_KEY environment variable in Vercel"
        echo "6. Replace pages/index.js with pages/index-secure.js"
        echo "7. Push changes to trigger deployment"
        ;;
        
    3)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🎉 Happy meal planning!"
