import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateDocumentParams {
  templateContent?: string;
  userPrompt: string;
  caseCategory: string;
  clientName?: string;
  additionalContext?: string;
  language: string;
}

export async function generateLegalDocument(params: GenerateDocumentParams): Promise<string> {
  const {
    templateContent,
    userPrompt,
    caseCategory,
    clientName,
    additionalContext,
    language,
  } = params;

  const languageInstruction = {
    en: 'Generate the document in English.',
    'zh-TW': 'Generate the document in Traditional Chinese (繁體中文).',
    'zh-CN': 'Generate the document in Simplified Chinese (简体中文).',
  }[language] || 'Generate the document in English.';

  const systemPrompt = `You are an expert legal assistant specializing in cryptocurrency and blockchain law. Your role is to help lawyers draft professional legal documents with precision and accuracy.

Key responsibilities:
- Draft clear, professional legal documents
- Follow legal writing conventions and formatting
- Include appropriate legal disclaimers
- Ensure compliance with cryptocurrency regulations
- Use proper legal terminology

${languageInstruction}`;

  const userMessage = `
Please generate a legal document with the following details:

Case Category: ${caseCategory}
${clientName ? `Client Name: ${clientName}` : ''}

User Request: ${userPrompt}

${templateContent ? `Template to follow:\n${templateContent}` : ''}

${additionalContext ? `Additional Context:\n${additionalContext}` : ''}

Please generate a complete, professional legal document that addresses the requirements above. Include:
1. Proper document title
2. Date and parties (if applicable)
3. Clear sections and subsections
4. Professional legal language
5. Relevant clauses and provisions
6. Appropriate disclaimers

Format the document in markdown for easy reading and editing.
`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response format from AI');
}

export async function analyzeLegalDocument(documentContent: string, query: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Please analyze the following legal document and answer this question: ${query}\n\nDocument:\n${documentContent}`,
      },
    ],
    system: 'You are an expert legal analyst specializing in cryptocurrency law. Provide clear, accurate analysis of legal documents.',
  });

  const content = message.content[0];
  if (content.type === 'text') {
    return content.text;
  }

  throw new Error('Unexpected response format from AI');
}
