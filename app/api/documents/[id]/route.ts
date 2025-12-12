import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents/[id] - Get single document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            title: true,
            category: true,
            clientName: true,
          },
        },
        template: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, status, type, language } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;
    if (type !== undefined) updateData.type = type;
    if (language !== undefined) updateData.language = language;

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
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
      message: 'Document updated successfully!',
      document,
    });
  } catch (error: any) {
    console.error('Error updating document:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully!',
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
