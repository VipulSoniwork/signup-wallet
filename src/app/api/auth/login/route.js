import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simple authentication with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Get user's wallet information
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('wallet_address')
      .eq('user_id', data.user.id)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: 'Failed to retrieve wallet information' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        walletAddress: walletData.wallet_address,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
