import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured in .env file' },
        { status: 500 }
      );
    }

    // Check if key has valid format
    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY has invalid format (should start with sk-ant-)' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Try to make a simple request
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Hello' }],
      });

      return NextResponse.json({
        success: true,
        message: 'API key is valid and working!',
        model: 'claude-3-haiku-20240307',
        response: message.content[0].type === 'text' ? message.content[0].text : 'No text',
      });
    } catch (aiError: any) {
      return NextResponse.json({
        error: 'API key exists but request failed',
        details: aiError.message || String(aiError),
        statusCode: aiError.status || 'unknown',
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
