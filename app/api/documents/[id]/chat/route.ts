import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeLegalDocument } from '@/lib/ai';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        content: true,
        title: true,
        type: true,
        language: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const aiReply = await analyzeLegalDocument(document.content, message);

    return NextResponse.json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error('Error in document chat:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
