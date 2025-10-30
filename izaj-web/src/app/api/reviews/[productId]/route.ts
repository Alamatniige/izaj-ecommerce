import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { productId } = await context.params;

    console.log('📊 [API] Fetching reviews for product:', productId);

    // Get reviews for this product
    const { data: reviews, error: reviewsError } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('❌ [API] Error fetching reviews:', reviewsError);
      return NextResponse.json(
        { success: false, error: reviewsError.message },
        { status: 500 }
      );
    }

    // Calculate ratings summary from reviews
    const total_reviews = reviews?.length || 0;
    const ratings = reviews?.map(r => r.rating) || [];
    const average_rating = total_reviews > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / total_reviews 
      : 0;
    
    const five_star = reviews?.filter(r => r.rating === 5).length || 0;
    const four_star = reviews?.filter(r => r.rating === 4).length || 0;
    const three_star = reviews?.filter(r => r.rating === 3).length || 0;
    const two_star = reviews?.filter(r => r.rating === 2).length || 0;
    const one_star = reviews?.filter(r => r.rating === 1).length || 0;

    const summary = {
      total_reviews,
      average_rating: Number(average_rating.toFixed(1)),
      five_star,
      four_star,
      three_star,
      two_star,
      one_star
    };

    console.log('✅ [API] Reviews fetched:', {
      total: total_reviews,
      average: average_rating.toFixed(1)
    });

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviews || [],
        summary
      }
    });

  } catch (error: any) {
    console.error('❌ [API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

