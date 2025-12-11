# Deployment Checklist for GPULaw Crypto

## ✅ Pre-Deployment Checklist

### 1. Code Ready
- [x] All features implemented
- [x] Build passes locally (`npm run build`)
- [x] No TypeScript errors
- [x] Prisma schema defined
- [x] API routes working

### 2. Environment Variables Prepared
Required environment variables for Vercel:

```bash
# Required
ANTHROPIC_API_KEY="sk-ant-..."

# Optional (for full functionality)
DATABASE_URL="postgresql://..."

# Auth (when implementing)
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-random-secret"
```

## 🚀 Vercel Deployment Steps

### Step 1: Push to GitHub
```bash
cd /Users/wlin/dev/gpulaw-crypto

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Complete GPULaw Crypto AI Legal Assistant"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/gpulaw-crypto.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Click "Import Git Repository"

2. **Select Repository**
   - Choose `gpulaw-crypto`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

#### Production Environment
```
ANTHROPIC_API_KEY = sk-ant-api03-... (your actual key)
NEXTAUTH_URL = https://your-project.vercel.app
NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
```

#### Optional: Database (Recommended)
If using Neon (recommended):
```
DATABASE_URL = postgresql://user:pass@host/db?sslmode=require
```

### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live at: `https://your-project.vercel.app`

## 🗄️ Database Setup (Optional but Recommended)

### Option 1: Neon (Recommended)

1. **Create Neon Account**
   - Visit: https://neon.tech
   - Sign up for free

2. **Create Database**
   - Create new project
   - Copy connection string

3. **Add to Vercel**
   - Go to Vercel project settings
   - Add `DATABASE_URL` environment variable
   - Paste Neon connection string

4. **Push Schema**
   ```bash
   # In your local project
   DATABASE_URL="your-neon-url" npx prisma db push
   ```

### Option 2: Supabase
- Visit: https://supabase.com
- Create project
- Get PostgreSQL connection string
- Follow same steps as Neon

### Option 3: Vercel Postgres
- Go to Vercel project → Storage
- Create Postgres database
- Connection string auto-added

## 🔐 Security Checklist

- [ ] `.env` is in `.gitignore` ✅
- [ ] API keys are in Vercel environment variables only
- [ ] Database uses SSL connection
- [ ] NEXTAUTH_SECRET is randomly generated
- [ ] No sensitive data in code

## 🧪 Post-Deployment Testing

### 1. Test Homepage
```
Visit: https://your-project.vercel.app/en
Check: Page loads, navigation works, language switcher works
```

### 2. Test Dashboard
```
Visit: /en/dashboard
Check: Dashboard loads, stats display, navigation works
```

### 3. Test Case Management
```
Visit: /en/dashboard/cases
Create: New case
Check: Form validation, submission works
```

### 4. Test AI Generation (Most Important!)
```
Visit: /en/dashboard/cases/[any-case-id]
Click: "Generate with AI"
Check: Modal opens, form works
Fill: Document requirements
Click: Generate
Wait: 10-30 seconds for AI response
Check: Document appears, content is relevant
```

### 5. Test Multi-Language
```
Switch to: /zh-TW/dashboard
Check: All text is in Traditional Chinese
Switch to: /zh-CN/dashboard
Check: All text is in Simplified Chinese
```

## 📊 Monitoring

### Check Logs
```bash
# Vercel CLI
npx vercel logs --follow

# Or in Vercel Dashboard:
Project → Deployments → [Latest] → Logs
```

### Monitor AI Usage
- Anthropic Console: https://console.anthropic.com
- Check usage and costs
- Set up billing alerts

## 🐛 Troubleshooting

### Build Fails
**Error**: "Prisma Client not generated"
**Solution**: Already fixed with `postinstall` script ✅

**Error**: "Module not found"
**Solution**: Check all imports use correct paths

### Runtime Errors
**Error**: "ANTHROPIC_API_KEY not found"
**Solution**: Add to Vercel environment variables

**Error**: "Database connection failed"
**Solution**:
- App still works in demo mode
- Check DATABASE_URL format
- Verify database is accessible

### AI Generation Fails
**Check**:
1. ANTHROPIC_API_KEY is correct
2. API key has credits
3. Check Vercel function logs
4. Verify API endpoint is accessible

## 💰 Cost Estimates

### Vercel (Free Tier)
- **Hosting**: Free
- **Bandwidth**: 100 GB/month
- **Build Minutes**: 6,000 minutes/month
- **Serverless Functions**: Free

### Anthropic Claude API
- **Claude 3.5 Sonnet**:
  - Input: $3 per 1M tokens
  - Output: $15 per 1M tokens
- **Per Document**: ~$0.03 - $0.10
- **1000 documents/month**: ~$30 - $100

### Neon Database (Free Tier)
- **Storage**: 512 MB
- **Compute**: Always available
- **Cost**: Free (upgrade if needed)

### Total Monthly Cost Estimate
- **Demo/Testing**: $0 (no AI generation)
- **Light Usage** (100 docs/month): ~$3 - $10
- **Medium Usage** (500 docs/month): ~$15 - $50
- **Heavy Usage** (2000 docs/month): ~$60 - $200

## 📈 Scaling Considerations

### When to Upgrade

**Vercel Pro ($20/month)**
- Need more than 100 GB bandwidth
- Want team collaboration
- Need advanced analytics

**Neon Pro ($19/month)**
- Need > 512 MB database
- Want automatic backups
- Need higher compute

**Anthropic API**
- Monitor usage in console
- Consider caching common documents
- Implement rate limiting

## 🎯 Next Steps After Deployment

1. **Add Authentication**
   - Implement NextAuth.js
   - Add user registration
   - Protect routes

2. **Database Integration**
   - Set up real database
   - Run migrations
   - Add seed data

3. **Custom Domain**
   - Purchase domain
   - Add to Vercel
   - Configure DNS

4. **Analytics**
   - Add Vercel Analytics
   - Track AI generation usage
   - Monitor performance

5. **Documentation**
   - Create user guide
   - Add API documentation
   - Write admin manual

## ✅ Launch Checklist

Before going live to clients:
- [ ] All features tested
- [ ] AI generation working
- [ ] Database connected
- [ ] Authentication added
- [ ] Custom domain configured
- [ ] Legal disclaimers added
- [ ] Privacy policy created
- [ ] Terms of service written
- [ ] User testing completed
- [ ] Performance optimized
- [ ] Security audit done
- [ ] Backup strategy in place

## 🆘 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Neon Docs**: https://neon.tech/docs

---

**Current Status**: ✅ Ready for deployment!

**Last Updated**: December 2024
