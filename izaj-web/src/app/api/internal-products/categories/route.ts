import { NextRequest, NextResponse } from 'next/server';

// Mock categories data - replace this with your actual database/backend logic
const mockCategories = [
  'Ceiling Light',
  'Chandelier',
  'Pendant Light',
  'Floor Lamp',
  'Table Lamp',
  'Wall Lamp',
  'Track Lighting',
  'Recessed Lighting',
  'Spotlight',
  'LED Strip',
  'Outdoor Lighting',
  'Lantern',
  'Smart Lighting',
  'Bulb',
  'Emergency Light',
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      categories: mockCategories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in categories API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
