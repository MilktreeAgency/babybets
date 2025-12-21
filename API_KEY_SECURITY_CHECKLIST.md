# 🔒 API Key Security Fix - Action Required Checklist

## ✅ COMPLETED (Automated)

The following security fixes have been automatically applied to your codebase:

- ✅ Removed hardcoded API key from `generate-all-images.cjs`
- ✅ Removed hardcoded API key from `generate-images.cjs`
- ✅ Updated both files to use environment variables via `dotenv`
- ✅ Installed `dotenv` package (added to package.json)
- ✅ Created `.env.example` template file
- ✅ Verified `.env` files are in `.gitignore`
- ✅ Created security documentation (`SECURITY_FIX.md`)
- ✅ Tested scripts properly reject missing API keys

## ⚠️ URGENT MANUAL STEPS REQUIRED

You must complete these steps **immediately** to secure your account:

### Step 1: Regenerate Your API Key (CRITICAL - DO THIS FIRST!)

The exposed API key **MUST** be regenerated to prevent unauthorized use:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Find project**: "Riftly AI Website" (ID: `gen-lang-client-0586876140`)
4. **Locate the key**: Look for `AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo`
5. **Click Edit** (pencil icon)
6. **Click "Regenerate Key"** button
7. **Copy the new key** to your clipboard
8. **Add restrictions** (see Step 2 below)

### Step 2: Add API Key Restrictions

While editing your API key, add these security restrictions:

**Application Restrictions:**
- Option 1: Select "HTTP referrers (web sites)"
  - Add your production domain(s): `https://babybets.co.uk/*`
  - Add localhost for dev: `http://localhost:*`
- Option 2: Select "IP addresses" (if using server-side only)
  - Add your server IP addresses

**API Restrictions:**
- Select "Restrict key"
- Enable ONLY: "Generative Language API"
- Disable all other APIs

**Save** the restrictions.

### Step 3: Create Local `.env` File

```bash
cd /Users/levi/Desktop/Website\ Files/babybets
cp .env.example .env
```

Then edit `.env` and add your **NEW** regenerated API key:

```env
GEMINI_API_KEY=your_new_regenerated_api_key_here
```

**IMPORTANT:** 
- Use the NEW key from Step 1, NOT the old exposed key
- Never commit the `.env` file to git
- Keep this file secure on your local machine

### Step 4: Test the Fix

Run the image generation script to verify it works:

```bash
node generate-images.cjs
```

**Expected success output:**
```
Image generation prompts ready!
Total competitions: 30
Prompts saved to public/images/image-prompts.json
```

**If you see an error about missing API key:**
- Make sure `.env` file exists in the project root
- Verify `GEMINI_API_KEY=your_actual_key` is in the file
- No spaces around the `=` sign
- No quotes around the key value

### Step 5: Commit the Security Fix

```bash
# Stage the security fixes (NOT the .env file!)
git add generate-all-images.cjs
git add generate-images.cjs
git add .env.example
git add package.json
git add package-lock.json
git add SECURITY_FIX.md
git add API_KEY_SECURITY_CHECKLIST.md

# Commit the changes
git commit -m "🔒 Security: Remove hardcoded API key, implement environment variables

- Remove exposed Google Gemini API key from source code
- Implement dotenv for secure environment variable management
- Add .env.example template for developers
- Update scripts with API key validation
- Add comprehensive security documentation

Fixes: Publicly exposed API key vulnerability reported by Google"

# Push to GitHub
git push origin main
```

### Step 6: Review Google Cloud Activity

Check for any suspicious activity while the key was exposed:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Dashboard**
3. Look for unusual traffic or quota usage
4. Check **Billing** for unexpected charges
5. Review **Logs Explorer** for suspicious requests

If you see anything suspicious:
- Document the suspicious activity
- Contact Google Cloud Support immediately
- Consider enabling additional security measures (2FA, audit logs)

### Step 7: Clean Git History (HIGHLY RECOMMENDED)

The old API key still exists in your Git history. To completely remove it:

**Option A: Using BFG Repo-Cleaner (Easiest)**
```bash
# Install BFG (macOS)
brew install bfg

# Backup your repo first!
cd /Users/levi/Desktop/Website\ Files
cp -r babybets babybets-backup

# Remove the sensitive data from history
cd babybets
bfg --replace-text <(echo "AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo==>REDACTED")

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: Coordinate with team first!)
git push origin main --force
```

**Option B: Archive and Start Fresh (Nuclear Option)**
```bash
# This loses all Git history but is the most secure
cd /Users/levi/Desktop/Website\ Files
mv babybets babybets-old
mkdir babybets
cd babybets
git init
# Copy all files from babybets-old (except .git)
# Then make initial commit
```

**⚠️ Important Notes for Git History Cleaning:**
- Backup your repository first!
- Force pushing rewrites history and affects all collaborators
- Inform your team before doing this
- All team members will need to re-clone the repository
- The old key will still exist on GitHub's servers for ~30 days in the reflog

## 📋 Verification Checklist

Before considering this issue resolved, verify:

- [ ] Old API key has been regenerated in Google Cloud Console
- [ ] New API key has API restrictions applied
- [ ] New API key has application restrictions applied
- [ ] Local `.env` file created with NEW key
- [ ] `dotenv` package is installed (check package.json)
- [ ] Scripts run successfully with new environment setup
- [ ] No hardcoded API keys remain in any files
- [ ] `.env` is in `.gitignore` (already verified ✓)
- [ ] Security fix has been committed to Git
- [ ] Changes have been pushed to GitHub
- [ ] Google Cloud usage reviewed for suspicious activity
- [ ] Git history cleaned (optional but recommended)
- [ ] Team members notified to update their `.env` files

## 🔍 How to Verify No Keys Remain

Run this command to scan for API keys:

```bash
cd /Users/levi/Desktop/Website\ Files/babybets
grep -r "AIza[A-Za-z0-9_-]\{35\}" --exclude-dir=node_modules --exclude="*.md" .
```

**Expected output:** No matches (or only in .md documentation files)

If you find any matches in code files, they need to be removed immediately.

## 📞 Need Help?

If you encounter issues:

1. **Script fails with "GEMINI_API_KEY not found"**
   - Ensure `.env` file exists in project root
   - Check file contains `GEMINI_API_KEY=your_key`
   - Verify no extra spaces or quotes

2. **New API key doesn't work**
   - Wait 1-2 minutes for propagation
   - Verify API restrictions allow your use case
   - Check Google Cloud Console for error messages

3. **Git push issues**
   - If rejected, pull latest changes first
   - Resolve any merge conflicts
   - Then push again

4. **BFG/history cleaning issues**
   - Make sure you have a backup
   - Consider the "archive and start fresh" approach
   - Or accept that the key exists in history (it's already invalidated)

## 📚 Additional Resources

- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Securing API Keys](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

---

## 🎯 Quick Start (TL;DR)

For immediate action:

```bash
# 1. Regenerate key at: https://console.cloud.google.com/apis/credentials
# 2. Create .env file
echo "GEMINI_API_KEY=your_new_key_here" > .env

# 3. Test
node generate-images.cjs

# 4. Commit and push
git add generate-all-images.cjs generate-images.cjs .env.example package*.json *.md
git commit -m "🔒 Security: Remove hardcoded API key"
git push origin main
```

**Current Status:** ✅ Code Fixed | ⏳ Manual Steps Required

**Priority:** 🔴 URGENT - Complete Steps 1-3 immediately

