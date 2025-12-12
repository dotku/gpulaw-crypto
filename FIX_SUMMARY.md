# Fixes Applied & Troubleshooting

## ✅ Fixes Completed

### 1. Edit Mode Auto-Fullscreen ✅
**File**: `app/[locale]/dashboard/documents/generate/page.tsx:158-165`

Changed edit mode to automatically enter fullscreen:
```typescript
const handleEdit = () => {
  const newEditMode = !isEditMode;
  setIsEditMode(newEditMode);
  // Automatically enter fullscreen when entering edit mode
  if (newEditMode) {
    setIsFullscreen(true);
  }
};
```

**Result**: Clicking "Edit" now automatically expands to full-screen editor mode

---

### 2. Database Schema Applied ✅
Ran `npx prisma db push` successfully.

**Result**: Database is now in sync with Prisma schema. Cases and documents can now be saved permanently.

---

## ⚠️ Issue: AI Document Generation Failing

### Problem
Getting 404 error: `model not found` when trying to generate documents

### Root Cause
The Anthropic API is returning 404 for ALL model IDs tried:
- `claude-3-5-sonnet-20241022` ❌
- `claude-3-5-sonnet-20240620` ❌  
- `claude-3-5-sonnet-latest` ❌
- `claude-3-sonnet-20240229` ❌

This suggests an issue with the Anthropic API key or account access.

### Troubleshooting Steps

#### 1. Check API Key in .env
Verify your `ANTHROPIC_API_KEY` in `/Users/wlin/dev/gpulaw-crypto/.env`:

```bash
# Should look like this:
ANTHROPIC_API_KEY=sk-ant-api03-...
```

#### 2. Verify API Key in Anthropic Console
Visit: https://console.anthropic.com/settings/keys

- Check if the key is valid
- Check if it has been revoked
- Check which models are available for your account tier
- Regenerate key if needed

#### 3. Check Account Tier
Some API keys may have restricted model access:
- Free tier: May not have access to all models
- Paid tier: Should have access to all models

Visit: https://console.anthropic.com/settings/plans

#### 4. Test API Key with cURL
```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

If this returns a 404, the issue is with the API key or account.

#### 5. Model Availability by Region
Some models may not be available in all regions. Check:
https://docs.anthropic.com/en/docs/models-overview

---

## Current Model Configuration

**File**: `lib/ai.ts`

Currently set to: `claude-3-sonnet-20240229`

### Once API Key Issue is Resolved

For best results, update to Claude 3.5 Sonnet (if available):

```typescript
model: 'claude-3-5-sonnet-20241022',  // Latest version
max_tokens: 8192,                      // Increased for longer documents
```

---

## Quick Fix Options

### Option A: Use Different AI Provider (Temporary)
If Anthropic access is limited, consider:
- OpenAI GPT-4 Turbo
- Google Gemini Pro
- Local LLM (Ollama + Mistral)

### Option B: Mock Mode (Testing)
Temporarily use mock responses for testing UI:

Update `lib/ai.ts`:
```typescript
export async function generateLegalDocument(params: GenerateDocumentParams): Promise<string> {
  // TEMPORARY: Return mock document
  return `# Legal Document - ${params.caseCategory}
  
## Client: ${params.clientName}

[Mock AI-generated content]

This is a placeholder while AI service is being configured.
`;
}
```

---

## Expected Behavior After Fix

1. User fills in document generation form
2. Clicks "Generate"
3. API calls Anthropic Claude
4. Legal document generated in 10-30 seconds
5. Document appears in preview panel
6. User can edit, save, or download

---

## Testing After Fix

```bash
# Test document generation
curl -X POST http://localhost:3000/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "Generate compliance checklist for crypto exchange",
    "caseCategory": "CRYPTO_EXCHANGE_COMPLIANCE",
    "clientName": "Test Exchange",
    "language": "en",
    "userId": "demo-user"
  }'
```

Should return:
```json
{
  "success": true,
  "content": "# Legal Document...",
  "document": null  // or document object if database is connected
}
```

---

## Next Steps

1. **Verify Anthropic API key** in console
2. **Check model availability** for your account
3. **Test with cURL** to isolate the issue
4. **Update .env** with valid API key
5. **Restart dev server**: `npm run dev`
6. **Test document generation** in browser

---

**Status**: 
- ✅ Edit mode fullscreen: Fixed
- ✅ Database schema: Applied
- ⚠️ AI generation: Needs API key verification

**Last Updated**: December 11, 2024
