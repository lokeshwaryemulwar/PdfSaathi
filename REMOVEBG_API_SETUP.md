# Remove.bg API Setup

## Getting Your API Key

1. Go to https://www.remove.bg/api
2. Sign up for a free account
3. You'll get **50 free API calls per month**
4. Copy your API key from the dashboard

## Setting Up the API Key

### For Local Development:
Create a `.env` file in the `server` directory:
```
REMOVEBG_API_KEY=your_api_key_here
```

### For Render Deployment:
1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add a new environment variable:
   - Key: `REMOVEBG_API_KEY`
   - Value: `your_api_key_here`
5. Save changes

## API Limits

- **Free Tier:** 50 API calls/month
- **Preview Size:** Unlimited (lower resolution)
- **Full Size:** Counts towards your quota

## Upgrading (Optional)

If you need more than 50 images/month:
- **Subscription:** Starting at $9/month for 500 credits
- **Pay-as-you-go:** $0.20 per image

Visit https://www.remove.bg/pricing for details.
