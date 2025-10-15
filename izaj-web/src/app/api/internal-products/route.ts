import { NextRequest, NextResponse } from 'next/server';

// Mock product data - replace this with your actual database/backend logic
const mockProducts = [
  {
    id: '1',
    product_id: 'P001',
    product_name: 'Abednego | Chandelier/Large',
    price: 2999,
    status: 'active',
    category: 'Chandelier',
    branch: 'Main',
    description: 'Elegant large chandelier perfect for dining rooms and living spaces',
    image_url: '/abed.webp',
    publish_status: true,
    display_quantity: 10,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '2',
    product_id: 'P002',
    product_name: 'Abednego | Chandelier/Medium',
    price: 2499,
    status: 'active',
    category: 'Chandelier',
    branch: 'Main',
    description: 'Medium-sized chandelier ideal for bedrooms and smaller spaces',
    image_url: '/abed2.webp',
    publish_status: true,
    display_quantity: 15,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '3',
    product_id: 'P003',
    product_name: 'Aberdeen | Ceiling Light',
    price: 1299,
    status: 'active',
    category: 'Ceiling Light',
    branch: 'Main',
    description: 'Modern ceiling light with LED technology',
    image_url: '/aber.webp',
    publish_status: true,
    display_quantity: 25,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '4',
    product_id: 'P004',
    product_name: 'Aberdeen | Pendant Light',
    price: 899,
    status: 'active',
    category: 'Pendant Light',
    branch: 'Main',
    description: 'Stylish pendant light for kitchen islands and dining areas',
    image_url: '/aber2.webp',
    publish_status: true,
    display_quantity: 20,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '5',
    product_id: 'P005',
    product_name: 'Academy | Floor Lamp',
    price: 1599,
    status: 'active',
    category: 'Floor Lamp',
    branch: 'Main',
    description: 'Contemporary floor lamp with adjustable height',
    image_url: '/acad.webp',
    publish_status: true,
    display_quantity: 12,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '6',
    product_id: 'P006',
    product_name: 'Aeris | Table Lamp',
    price: 699,
    status: 'active',
    category: 'Table Lamp',
    branch: 'Main',
    description: 'Compact table lamp perfect for bedside tables',
    image_url: '/aeris.webp',
    publish_status: true,
    display_quantity: 30,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '7',
    product_id: 'P007',
    product_name: 'Afina | Wall Lamp',
    price: 799,
    status: 'active',
    category: 'Wall Lamp',
    branch: 'Main',
    description: 'Elegant wall lamp for ambient lighting',
    image_url: '/afina.webp',
    publish_status: true,
    display_quantity: 18,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '8',
    product_id: 'P008',
    product_name: 'Aina | Outdoor Lighting',
    price: 1999,
    status: 'active',
    category: 'Outdoor Lighting',
    branch: 'Main',
    description: 'Weather-resistant outdoor lighting fixture',
    image_url: '/aina.webp',
    publish_status: true,
    display_quantity: 8,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '9',
    product_id: 'P009',
    product_name: 'Alabaster | Smart Lighting',
    price: 3499,
    status: 'active',
    category: 'Smart Lighting',
    branch: 'Main',
    description: 'WiFi-enabled smart lighting with app control',
    image_url: '/alab.webp',
    publish_status: true,
    display_quantity: 5,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '10',
    product_id: 'P010',
    product_name: 'Alpha | LED Strip',
    price: 299,
    status: 'active',
    category: 'LED Strip',
    branch: 'Main',
    description: 'Flexible LED strip lighting for accent illumination',
    image_url: '/alph.webp',
    publish_status: true,
    display_quantity: 50,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '11',
    product_id: 'P011',
    product_name: 'Amara | Bulb',
    price: 199,
    status: 'active',
    category: 'Bulb',
    branch: 'Main',
    description: 'Energy-efficient LED bulb with warm white light',
    image_url: '/ama.webp',
    publish_status: true,
    display_quantity: 100,
    last_sync_at: new Date().toISOString(),
  },
  {
    id: '12',
    product_id: 'P012',
    product_name: 'Antique | Emergency Light',
    price: 1299,
    status: 'active',
    category: 'Emergency Light',
    branch: 'Main',
    description: 'Battery backup emergency lighting system',
    image_url: '/ant.webp',
    publish_status: true,
    display_quantity: 15,
    last_sync_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.product_name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in internal-products API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
