import { NextResponse } from 'next/server';
import { translateTexts } from '@/app/lib/services/translation';

/**
 * 翻訳API
 *
 * POST /api/translate
 *
 * リクエスト: { texts: string[] }
 * レスポンス: { translations: string[], cached: boolean, mock: boolean }
 *
 * 翻訳ロジックは app/lib/services/translation.ts に一元化
 */

interface TranslateRequest {
  texts: string[];
}

export async function POST(request: Request) {
  try {
    const body: TranslateRequest = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'texts配列が必要です' },
        { status: 400 }
      );
    }

    const translations = await translateTexts(texts);

    return NextResponse.json({
      translations,
      cached: false,
      mock: !process.env.GOOGLE_TRANSLATE_API_KEY,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      {
        error: '翻訳に失敗しました',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
