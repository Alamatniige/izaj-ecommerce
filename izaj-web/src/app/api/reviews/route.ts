import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, order_number, items, rating, comment, user_id } = body;

    // Get a valid user_id if not provided
    let validUserId = user_id;
    if (!validUserId) {
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1);
      validUserId = users?.[0]?.id || 'e6c90eb7-b991-4577-8e80-37da751c5e1a';
    }


    if (!order_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid review data' },
        { status: 400 }
      );
    }

    // Create reviews for each product in the order
    const reviewsToInsert = items.map((item: any) => ({
      user_id: validUserId,
      product_id: item.product_id,
      order_id: order_id,
      rating: rating,
      comment: comment,
      product_name: item.product_name,
      order_number: order_number,
      status: 'pending', // Set as pending - needs admin approval before appearing on website
      verified_purchase: true,
      created_at: new Date().toISOString()
    }));

    // Insert reviews into database using admin client
    const { data, error } = await supabaseAdmin
      .from('product_reviews')
      .insert(reviewsToInsert)
      .select();

    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reviews submitted successfully. They will appear on the website after admin approval.',
      data: data
    });

  } catch (error: any) {
    console.error('Error creating reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit reviews' },
      { status: 500 }
    );
  }
}