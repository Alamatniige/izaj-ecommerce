import { NextRequest, NextResponse } from 'next/server';

// Mock media data - replace this with your actual database/backend logic
const mockMediaData: { [key: string]: string[] } = {
  '1': ['/abed.webp', '/abed2.webp'],
  '2': ['/abed2.webp', '/abed.webp'],
  '3': ['/aber.webp', '/aber2.webp', '/aber3.webp'],
  '4': ['/aber2.webp', '/aber.webp'],
  '5': ['/acad.webp'],
  '6': ['/aeris.webp'],
  '7': ['/afina.webp'],
  '8': ['/aina.webp'],
  '9': ['/alab.webp'],
  '10': ['/alph.webp'],
  '11': ['/ama.webp'],
  '12': ['/ant.webp'],
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const mediaUrls = mockMediaData[id] || [];

    return NextResponse.json({
      success: true,
      mediaUrls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in product media API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product media' },
      { status: 500 }
    );
  }
}
