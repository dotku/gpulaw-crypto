import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const caseId = searchParams.get('caseId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const where: any = { userId };
    if (caseId) {
      where.caseId = caseId;
    }

    try {
      const documents = await prisma.document.findMany({
        where,
        include: {
          case: {
            select: {
              title: true,
              category: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return NextResponse.json({ success: true, documents });
    } catch (dbError) {
      console.error('Database error, returning empty array:', dbError);

      // Demo mode fallback - return empty array if database fails
      return NextResponse.json({
        success: true,
        documents: [],
        demo: true
      });
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, type, caseId, userId, language, templateId, status } = body;

    // Validate required fields
    if (!title || !content || !type || !caseId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, type, caseId, userId' },
        { status: 400 }
      );
    }

    try {
      // Create the document in the database
      const document = await prisma.document.create({
        data: {
          title,
          content,
          type,
          caseId,
          userId,
          language: language || 'en',
          templateId: templateId || null,
          status: status || 'AI_GENERATED',
        },
        include: {
          case: {
            select: {
              title: true,
              category: true,
              clientName: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Document saved successfully!',
        document,
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);

      // Demo mode fallback
      const mockDocument = {
        id: 'demo-' + Date.now(),
        title,
        content,
        type,
        caseId,
        userId,
        language: language || 'en',
        status: status || 'AI_GENERATED',
        createdAt: new Date(),
        updatedAt: new Date(),
        case: {
          title: 'Demo Case',
          category: 'CRYPTO_EXCHANGE_COMPLIANCE',
          clientName: 'Demo Client',
        },
      };

      return NextResponse.json({
        success: true,
        message: 'Document saved successfully! (Demo mode - not persisted to database)',
        document: mockDocument,
        demo: true,
      });
    }
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
