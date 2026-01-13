
# FitAI Tracker - Troubleshooting Guide

## App Not Starting

If your app isn't working, here are the most common issues and solutions:

### 1. Port Conflict (Most Common)
**Problem:** The Expo dev server can't start because port 8081 is already in use.

**Solution:**
- Close all terminal windows running Expo
- Kill any processes using port 8081
- Restart the Expo dev server

### 2. Clear Cache
Sometimes cached data can cause issues.

**Solution:**
- Stop the dev server
- Run: `npx expo start --clear`
- This will clear the Metro bundler cache

### 3. Reinstall Dependencies
If packages are corrupted or missing.

**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json` or `yarn.lock`
- Run: `npm install` or `yarn install`
- Restart the dev server

### 4. Check Your Internet Connection
The app needs internet to:
- Connect to Supabase backend
- Call OpenAI APIs for AI features
- Load images and assets

### 5. Backend Issues
If the app loads but features don't work:
- Check if Supabase Edge Functions are deployed
- Verify OpenAI API keys are configured
- Check backend logs for errors

## Current App Structure

The app has been simplified to 5 main tabs:
1. **Home** - Dashboard with quick actions
2. **Meals** - Food tracking with AI image recognition
3. **Workouts** - Workout logging and AI routine generation
4. **Progress** - Charts and analytics
5. **Profile** - User settings and fitness goals

Additional screens (AI Content Generator, Testing Guide) are accessible from the Home screen.

## Key Features

- ✅ AI-powered food recognition from photos
- ✅ AI workout routine generation with instruction images
- ✅ Daily workout checklist
- ✅ Progress tracking with charts
- ✅ Macro tracking
- ✅ Calorie counting

## Need Help?

If the app still isn't working:
1. Check the console logs for specific error messages
2. Verify all Supabase Edge Functions are deployed
3. Ensure OpenAI API keys are configured in Supabase
4. Try running on a different device/simulator
