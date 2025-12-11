import { NextRequest, NextResponse } from 'next/server';
import { generateLegalDocument } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      caseId,
      caseCategory,
      clientName,
      templateId,
      userPrompt,
      additionalContext,
      language = 'en',
      userId,
    } = body;

    // Validate required fields
    if (!userPrompt) {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    // Determine case details
    let finalCaseCategory = caseCategory;
    let finalClientName = clientName;

    // If caseId is provided and not 'demo', try to get from database
    if (caseId && caseId !== 'demo') {
      try {
        const caseData = await prisma.case.findUnique({
          where: { id: caseId },
        });

        if (caseData) {
          finalCaseCategory = caseData.category;
          finalClientName = caseData.clientName;
        }
      } catch (dbError) {
        console.warn('Database not available, using provided data');
      }
    }

    // Get template if specified
    let templateContent: string | undefined;
    if (templateId) {
      try {
        const template = await prisma.documentTemplate.findUnique({
          where: { id: templateId },
        });
        templateContent = template?.content;
      } catch (dbError) {
        console.warn('Database not available for template');
      }
    }

    // Generate document using AI
    const generatedContent = await generateLegalDocument({
      templateContent,
      userPrompt,
      caseCategory: finalCaseCategory || 'CRYPTO_EXCHANGE_COMPLIANCE',
      clientName: finalClientName,
      additionalContext,
      language,
    });

    // Try to save document to database
    let document = null;
    if (caseId && caseId !== 'demo' && userId && userId !== 'demo-user') {
      try {
        document = await prisma.document.create({
          data: {
            title: `${finalCaseCategory} - ${new Date().toLocaleDateString()}`,
            content: generatedContent,
            type: 'LEGAL_OPINION',
            status: 'AI_GENERATED',
            language,
            caseId,
            userId,
            templateId: templateId || undefined,
          },
        });
      } catch (dbError) {
        console.warn('Database not available for saving document');
      }
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      document,
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
