import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getWalletBalance, decryptWalletData } from '@/lib/blockchain/wallet';

export async function GET(request) {
  try {
    // Get the user ID from the request
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's wallet information from the database
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('wallet_address, encrypted_private_key, encrypted_recovery_phrase')
      .eq('user_id', userId)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: 'Failed to retrieve wallet information' },
        { status: 500 }
      );
    }

    // Get the wallet balance
    const balance = await getWalletBalance(walletData.wallet_address);

    return NextResponse.json({
      walletAddress: walletData.wallet_address,
      balance,
      hasPrivateKey: !!walletData.encrypted_private_key,
      hasRecoveryPhrase: !!walletData.encrypted_recovery_phrase,
    });
  } catch (error) {
    console.error('Error retrieving wallet info:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, password, dataType } = await request.json();

    // Validate input
    if (!userId || !password || !dataType) {
      return NextResponse.json(
        { error: 'User ID, password, and data type are required' },
        { status: 400 }
      );
    }

    // Verify that dataType is valid
    if (dataType !== 'privateKey' && dataType !== 'recoveryPhrase') {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Get user's wallet information from the database
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('encrypted_private_key, encrypted_recovery_phrase')
      .eq('user_id', userId)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: 'Failed to retrieve wallet information' },
        { status: 500 }
      );
    }

    // Determine which encrypted data to decrypt
    const encryptedData = dataType === 'privateKey' 
      ? walletData.encrypted_private_key 
      : walletData.encrypted_recovery_phrase;

    if (!encryptedData) {
      return NextResponse.json(
        { error: `Wallet ${dataType} not found` },
        { status: 404 }
      );
    }

    // Decrypt the requested data
    try {
      const decryptedData = await decryptWalletData(encryptedData, password);
      
      return NextResponse.json({
        [dataType]: decryptedData,
      });
    } catch (decryptError) {
      return NextResponse.json(
        { error: 'Failed to decrypt wallet data. Please check your password.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error retrieving sensitive wallet data:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
