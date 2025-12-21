# 🔒 Security Fix - API Key Exposure Resolution

## Issue Summary
On December 21, 2025, Google notified us that a Google API key was publicly exposed in the GitHub repository at:
- `generate-all-images.cjs` (line 8)
- `generate-images.cjs` (line 5)

**Exposed API Key:** `AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo`

**Public URL:** https://github.com/MilktreeAgency/babybets/blob/4152c202eab92cfc901af926b4f2dd621e545124/generate-all-images.cjs

## Immediate Actions Required

### 1. 🔑 Regenerate the Compromised API Key

**CRITICAL: You MUST do this immediately!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Find the project: **Riftly AI Website** (ID: `gen-lang-client-0586876140`)
4. Locate the exposed API key (`AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo`)
5. Click **Edit** on the key
6. Click **Regenerate Key** button
7. Copy the new API key
8. Add API key restrictions:
   - **Application restrictions**: Select "HTTP referrers" or "IP addresses" as appropriate
   - **API restrictions**: Restrict to only "Generative Language API"

### 2. 📝 Update Local Environment

1. Create a `.env` file in the project root (already in `.gitignore`):
```bash
cp .env.example .env
```

2. Edit `.env` and add your NEW regenerated API key:
```env
GEMINI_API_KEY=your_new_regenerated_api_key_here
```

3. Install dotenv package (if not already installed):
```bash
npm install dotenv
```

### 3. ✅ Verify the Fix

The following files have been updated to use environment variables:
- ✅ `generate-all-images.cjs` - Now reads from `process.env.GEMINI_API_KEY`
- ✅ `generate-images.cjs` - Now reads from `process.env.GEMINI_API_KEY`
- ✅ `.env.example` - Template file for developers (safe to commit)
- ✅ `.gitignore` - Already includes `.env` (will not be committed)

### 4. 🧹 Clean Git History (Optional but Recommended)

The exposed API key still exists in your Git history. Consider these options:

**Option A: Remove from History (Advanced)**
```bash
# WARNING: This rewrites Git history and requires force push
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch generate-all-images.cjs generate-images.cjs" \
  --prune-empty --tag-name-filter cat -- --all
```

**Option B: Use BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Replace the exposed key in all commits
bfg --replace-text <(echo "AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo==>REMOVED")

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Option C: Archive and Start Fresh (Nuclear Option)**
1. Archive the current repository
2. Create a new repository with the fixed code
3. This is the cleanest but loses all Git history

### 5. 🚀 Deploy the Fixed Code

```bash
# Stage the fixed files
git add generate-all-images.cjs generate-images.cjs .env.example SECURITY_FIX.md

# Commit the security fix
git commit -m "🔒 Security: Remove hardcoded API key, use environment variables"

# Push to GitHub
git push origin main
```

**Note:** After cleaning Git history (if you chose Option A or B), you'll need to force push:
```bash
git push origin main --force
```

⚠️ **WARNING:** Coordinate with your team before force pushing!

## What Changed

### Before (INSECURE ❌)
```javascript
const GEMINI_API_KEY = 'AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo';
```

### After (SECURE ✅)
```javascript
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY not found in environment variables');
  console.error('Please create a .env file with your API key:');
  console.error('GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}
```

## Security Best Practices Going Forward

### ✅ DO:
- Store all API keys, secrets, and tokens in environment variables
- Use `.env` files locally (never commit them)
- Use `.env.example` as a template (safe to commit)
- Add API key restrictions in Google Cloud Console
- Regularly rotate API keys
- Use separate API keys for development/staging/production
- Monitor API usage in Google Cloud Console
- Set up billing alerts

### ❌ DON'T:
- Never hardcode API keys in source code
- Never commit `.env` files to Git
- Never share API keys in chat, email, or public forums
- Never use production keys in development
- Never skip API key restrictions

## Verification Checklist

- [ ] Old API key has been regenerated in Google Cloud Console
- [ ] API restrictions have been added (HTTP referrers + API restrictions)
- [ ] New API key has been added to local `.env` file
- [ ] `.env` file is listed in `.gitignore`
- [ ] `dotenv` package is installed (`npm install dotenv`)
- [ ] Image generation scripts work with new environment variable setup
- [ ] Fixed code has been committed and pushed to GitHub
- [ ] (Optional) Git history has been cleaned to remove exposed key
- [ ] Team members have been notified to update their local `.env` files
- [ ] Google Cloud Console billing/usage has been reviewed for unexpected activity

## Testing the Fix

Run the image generation script to verify it works:

```bash
node generate-images.cjs
```

Expected output if `.env` is missing:
```
❌ Error: GEMINI_API_KEY not found in environment variables
Please create a .env file with your API key:
GEMINI_API_KEY=your_api_key_here
```

Expected output if `.env` is configured correctly:
```
Image generation prompts ready!
Total competitions: 30
Prompts saved to public/images/image-prompts.json
```

## Additional Resources

- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Handling Compromised GCP Credentials](https://cloud.google.com/iam/docs/compromised-credentials)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git Filter-Branch Documentation](https://git-scm.com/docs/git-filter-branch)

## Support

If you encounter any issues with this security fix:
1. Ensure `dotenv` package is installed: `npm install dotenv`
2. Verify `.env` file exists and contains `GEMINI_API_KEY=your_key`
3. Check that the API key is valid in Google Cloud Console
4. Review API key restrictions aren't blocking legitimate requests

---

**Status:** ✅ Code Fixed | ⏳ Awaiting Manual Steps (API Key Regeneration)

**Last Updated:** December 21, 2025
**Fixed By:** Security Audit
**Severity:** HIGH - Publicly exposed API key
**Resolution:** Environment variable implementation + API key regeneration required

