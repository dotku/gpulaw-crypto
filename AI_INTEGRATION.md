# GPULaw Crypto - AI Integration Guide

## Overview

This application integrates Claude AI to generate professional legal documents for cryptocurrency compliance cases. The AI understands legal terminology, regulatory requirements, and can generate documents in multiple languages.

## Features

### 1. AI Document Generation
- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **Languages**: English, Traditional Chinese, Simplified Chinese
- **Document Types**: Legal opinions, compliance reports, user agreements, regulatory filings

### 2. Case-Integrated Workflow

#### Method 1: Generate from Case Details
1. Navigate to a case: `/dashboard/cases/[id]`
2. Click "Generate with AI" button
3. Describe the document you need
4. Review and edit context
5. Generate document

#### Method 2: Direct Generation
1. Go to `/dashboard/documents/generate`
2. Fill in case details manually
3. Describe document requirements
4. Generate document

## Setup Instructions

### 1. Get Your Anthropic API Key

```bash
# Visit https://console.anthropic.com
# Create an account and generate an API key
```

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Database Setup (Optional)

For full functionality, setup PostgreSQL database:

```bash
# Update .env with your database URL
DATABASE_URL="postgresql://..."

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Usage Examples

### Example 1: Generate ICO Legal Opinion

**Input:**
- Case Category: ICO Legal Opinion
- Client: TokenCo Ltd.
- Prompt: "Generate a legal opinion regarding the token classification under securities law"
- Language: English

**Output:**
A comprehensive legal opinion document covering:
- Token characteristics analysis
- Securities law applicability
- Regulatory compliance requirements
- Risk assessment
- Recommendations

### Example 2: AML Compliance Report (Chinese)

**Input:**
- Case Category: AML Compliance
- Client: Crypto Exchange XYZ
- Prompt: "評估交易所的反洗錢合規性" (Assess exchange AML compliance)
- Language: Traditional Chinese (zh-TW)

**Output:**
A detailed compliance report in Traditional Chinese.

## API Endpoints

### POST /api/documents/generate

Generate a legal document using AI.

**Request Body:**
```json
{
  "caseId": "optional-case-id",
  "caseCategory": "CRYPTO_EXCHANGE_COMPLIANCE",
  "clientName": "Client Name",
  "userPrompt": "What document to generate",
  "additionalContext": "Extra context",
  "language": "en",
  "userId": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "content": "Generated document content in markdown",
  "document": {
    "id": "doc-id",
    "title": "Document Title",
    ...
  }
}
```

## Demo Mode

The application works without a database connection in demo mode:
- Uses `caseId: "demo"` and `userId: "demo-user"`
- AI generation still works with Anthropic API key
- Documents are generated but not saved to database
- Perfect for testing and demonstrations

## Document Categories

The AI is trained to generate documents for:

1. **Crypto Exchange Compliance** - Exchange regulatory reviews
2. **ICO Legal Opinion** - Token offering legal analysis
3. **AML Compliance** - Anti-money laundering assessments
4. **User Agreement** - Terms of service, user agreements
5. **Regulatory Filing** - Government submission documents
6. **Licensing** - License applications and renewals
7. **Token Classification** - Token type legal analysis
8. **Smart Contract Audit** - Legal review of smart contracts

## Best Practices

### 1. Provide Context
Always include relevant case details and context for better AI generation quality.

### 2. Review and Edit
AI-generated documents should always be reviewed by qualified legal counsel before use.

### 3. Language Consistency
Use the same language for prompts and generated documents for best results.

### 4. Specific Prompts
Be specific about what you need:
- ✅ "Generate a legal opinion analyzing whether our token is a security under Howey Test"
- ❌ "Write a legal document"

## Troubleshooting

### Error: "Failed to generate document"

**Cause**: Missing or invalid Anthropic API key

**Solution**:
```bash
# Check your .env file
ANTHROPIC_API_KEY="sk-ant-..."

# Restart development server
npm run dev
```

### Error: "Database not available"

**Cause**: Database connection issue

**Solution**:
- App will work in demo mode
- To fix: Update DATABASE_URL and run `npx prisma db push`

### Slow Generation

**Cause**: Claude API processing time

**Expected**: 5-15 seconds for typical documents
- Complex documents may take longer
- This is normal AI processing time

## Cost Considerations

### Anthropic Pricing (as of Dec 2024)
- Claude 3.5 Sonnet: ~$3 per million input tokens, ~$15 per million output tokens
- Typical legal document: 500-2000 tokens input, 2000-4000 tokens output
- **Estimated cost per document**: $0.03 - $0.10

### Optimization Tips
1. Use specific prompts to reduce iterations
2. Reuse generated documents as templates
3. Monitor usage in Anthropic console

## Security Notes

1. **API Key Security**: Never commit `.env` to git
2. **User Authentication**: Add NextAuth.js before production
3. **Document Privacy**: Ensure proper access controls
4. **Audit Trail**: Track all AI generations for compliance

## Future Enhancements

- [ ] Document templates library
- [ ] Multi-turn conversations with AI
- [ ] Document comparison and diff
- [ ] PDF export with formatting
- [ ] Custom AI prompts per case type
- [ ] Citation and reference checking

## Support

For issues or questions:
- Check [README.md](./README.md) for general setup
- Review Anthropic docs: https://docs.anthropic.com
- Open an issue on GitHub

---

Last Updated: December 2024
