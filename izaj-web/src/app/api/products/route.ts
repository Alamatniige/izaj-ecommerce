import { NextRequest, NextResponse } from 'next/server';
import { InternalApiService } from '../../../services/internalApi';
import { NewsletterNotificationService } from '../../../services/newsletterNotifications';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '100';

    // Fetch from internal API with media URLs
    const response = await InternalApiService.getProductsWithMedia({
      page: parseInt(page),
      limit: parseInt(limit),
      category: category || undefined,
      search: search || undefined,
      // Remove status filter to get all products
    });

    if (response.success) {
      return NextResponse.json({
        success: true,
        data: response.products,
        total: response.pagination.total,
        pagination: response.pagination,
      });
    } else {
      throw new Error('Failed to fetch products from internal API');
    }
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'brand'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new product
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, you would save this to a database
    // For now, just return the created product
    console.log('Product created:', newProduct);

    // Send notification to newsletter subscribers
    try {
      await NewsletterNotificationService.notifyNewProducts([{
        name: newProduct.name,
        price: newProduct.price,
        imageUrl: newProduct.imageUrl || newProduct.image_url,
        productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/products/${newProduct.id}`,
        category: newProduct.category
      }]);
      console.log('✅ Newsletter notification sent for new product');
    } catch (notifyError) {
      console.error('Failed to send newsletter notification:', notifyError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating product:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
