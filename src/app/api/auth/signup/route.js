import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { generateWallet, encryptWalletData } from '@/lib/blockchain/wallet';

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

    // Register user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email verification for development
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Generate a new wallet for the user
    const walletData = generateWallet();

    // Encrypt sensitive wallet information using the user's password with proper data types
    const encryptedPrivateKey = await encryptWalletData(walletData.privateKey, password, 'privateKey');
    const encryptedRecoveryPhrase = await encryptWalletData(walletData.recoveryPhrase, password, 'recoveryPhrase');

    // Store wallet information in the database
    const { error: walletError } = await supabase
      .from('wallets')
      .insert({
        user_id: authData.user.id,
        wallet_address: walletData.address,
        encrypted_private_key: encryptedPrivateKey,
        encrypted_recovery_phrase: encryptedRecoveryPhrase,
      });

    if (walletError) {
      // If wallet creation fails, we should ideally delete the user account
      // but for simplicity, we'll just return an error
      console.error('Wallet creation error:', walletError);
      return NextResponse.json(
        { error: `Failed to create wallet: ${walletError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User registered successfully',
      userId: authData.user.id,
      walletAddress: walletData.address,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
