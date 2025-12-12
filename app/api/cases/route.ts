import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, clientName, category, description, userId } = body;

    // Validate required fields
    if (!title || !clientName || !category) {
      return NextResponse.json(
        { error: 'Title, client name, and category are required' },
        { status: 400 }
      );
    }

    // Try to create case in database
    try {
      const newCase = await prisma.case.create({
        data: {
          title,
          clientName,
          category,
          description: description || '',
          status: 'DRAFT',
          userId: userId || 'demo-user',
        },
      });

      return NextResponse.json({
        success: true,
        case: newCase,
      });
    } catch (dbError) {
      console.warn('Database not available, running in demo mode');

      // Return a mock case for demo mode
      const mockCase = {
        id: 'demo-' + Date.now(),
        title,
        clientName,
        category,
        description: description || '',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userId || 'demo-user',
      };

      return NextResponse.json({
        success: true,
        case: mockCase,
        demo: true,
      });
    }
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      {
        error: 'Failed to create case',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    // Try to get cases from database
    try {
      const cases = await prisma.case.findMany({
        where: {
          userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          documents: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        cases,
      });
    } catch (dbError) {
      console.warn('Database not available, returning demo data');

      // Return mock cases for demo mode
      const mockCases = [
        {
          id: 'demo-1',
          title: 'Crypto Exchange ABC Compliance Review',
          clientName: 'ABC Crypto Exchange',
          category: 'CRYPTO_EXCHANGE_COMPLIANCE',
          status: 'IN_PROGRESS',
          description: 'Comprehensive compliance review for a major cryptocurrency exchange operating in multiple jurisdictions.',
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2024-12-10'),
          userId: 'demo-user',
          documents: [
            {
              id: 'doc-1',
              title: 'AML Compliance Report',
              status: 'REVIEWED',
            },
          ],
        },
        {
          id: 'demo-2',
          title: 'Token Classification Analysis',
          clientName: 'XYZ Blockchain Corp',
          category: 'TOKEN_CLASSIFICATION',
          status: 'DRAFT',
          description: 'Legal opinion on token classification under securities law.',
          createdAt: new Date('2024-11-25'),
          updatedAt: new Date('2024-12-08'),
          userId: 'demo-user',
          documents: [],
        },
      ];

      return NextResponse.json({
        success: true,
        cases: mockCases,
        demo: true,
      });
    }
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch cases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
