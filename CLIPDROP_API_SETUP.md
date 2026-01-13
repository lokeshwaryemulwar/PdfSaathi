# Clipdrop API Setup (Recommended - More Reliable)

## Getting Your API Key

1. Go to https://clipdrop.co/apis
2. Sign up for a free account
3. You'll get **100 free API calls per month** (more than remove.bg!)
4. Go to your dashboard and copy your API key

## Setting Up the API Key

### For Render Deployment:
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add a new environment variable:
   - Key: `CLIPDROP_API_KEY`
   - Value: `your_clipdrop_api_key_here`
5. Save changes (Render will auto-redeploy)

### For Local Development:
Update your `server/.env` file:
```
CLIPDROP_API_KEY=your_clipdrop_api_key_here
```

## Why Clipdrop?

- ✅ **More reliable** - Better API stability
- ✅ **100 free calls/month** - Double the free tier of remove.bg
- ✅ **Better quality** - Uses advanced AI models
- ✅ **Faster** - Optimized for speed
- ✅ **No verification issues** - Works immediately after signup

## API Limits

- **Free Tier:** 100 API calls/month
- **Quality:** High resolution output
- **Speed:** ~2-3 seconds per image

## Fallback Support

The code supports both Clipdrop and remove.bg:
1. Tries Clipdrop first (if `CLIPDROP_API_KEY` is set)
2. Falls back to remove.bg (if `REMOVEBG_API_KEY` is set)
3. This gives you 150 free calls/month total if you use both!
