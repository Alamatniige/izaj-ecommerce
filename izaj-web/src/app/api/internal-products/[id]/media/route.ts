import { NextRequest, NextResponse } from 'next/server';

// Desktop backend configuration
const DESKTOP_BACKEND_URL = process.env.DESKTOP_BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    console.log('🔄 Product Media API: Fetching media for product:', id);

    // For now, return empty array since media handling might be different
    // You can implement actual media fetching from desktop backend here
    const mediaUrls: string[] = [];

    console.log('✅ Product Media API: Returning media URLs:', mediaUrls);

    return NextResponse.json({
      success: true,
      mediaUrls,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Product Media API: Error:', error);
    return NextResponse.json({
      success: true,
      mediaUrls: [],
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch media'
    });
  }
}