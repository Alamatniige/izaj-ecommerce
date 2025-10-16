import { NextRequest, NextResponse } from 'next/server';

// Desktop backend configuration
const DESKTOP_BACKEND_URL = process.env.DESKTOP_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Categories API: Fetching categories from desktop backend...');

    // Fetch categories from desktop backend
    const backendUrl = `${DESKTOP_BACKEND_URL}/api/categories`;
    console.log('📡 Categories API: Requesting from:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('❌ Categories API: Backend response error:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Return default categories if backend is not available
      return NextResponse.json({
        success: true,
        categories: [
          'Chandelier',
          'Ceiling Light',
          'Pendant Light',
          'Floor Lamp',
          'Table Lamp',
          'Wall Lamp',
          'Outdoor Lighting',
          'Smart Lighting',
          'LED Strip',
          'Bulb',
          'Emergency Light'
        ],
        timestamp: new Date().toISOString(),
        error: 'Backend not available, using default categories'
      });
    }

    const backendData = await response.json();
    console.log('✅ Categories API: Backend response:', backendData);

    return NextResponse.json({
      success: true,
      categories: backendData.categories || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Categories API: Error:', error);
    
    // Return default categories on error
    return NextResponse.json({
      success: true,
      categories: [
        'Chandelier',
        'Ceiling Light',
        'Pendant Light',
        'Floor Lamp',
        'Table Lamp',
        'Wall Lamp',
        'Outdoor Lighting',
        'Smart Lighting',
        'LED Strip',
        'Bulb',
        'Emergency Light'
      ],
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch categories from backend'
    });
  }
}