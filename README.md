# Crypto Wallet Authentication System

A secure authentication system with integrated blockchain wallet functionality built with Next.js, Framer Motion, Shadcn UI, and Supabase.

## Features

- **User Authentication**: Secure signup and login with email/password
- **Automatic Wallet Generation**: Creates an Ethereum wallet for each user upon registration
- **Wallet Dashboard**: View wallet balance and cryptocurrency assets
- **Secure Key Management**: Access private keys and recovery phrases with password verification
- **Modern UI**: Responsive design with smooth animations using Framer Motion

## Tech Stack

- **Frontend**:
  - Next.js 15.3.3
  - React 19
  - Framer Motion (animations)
  - Shadcn UI (component library)
  - TailwindCSS

- **Backend**:
  - Supabase (authentication, database)
  - Ethers.js (blockchain interaction)

## Prerequisites

- Node.js 18.17 or later
- Supabase account (for authentication and database)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd wallet-sign
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project in [Supabase](https://supabase.com/)
2. Create the following tables in your Supabase database:

#### Users Table
This is automatically created by Supabase Auth.

#### Wallets Table
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  wallet_address TEXT NOT NULL,
  encrypted_private_key TEXT NOT NULL,
  encrypted_recovery_phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX wallets_user_id_idx ON wallets(user_id);

-- Set up Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own wallet
CREATE POLICY "Users can only access their own wallet" 
  ON wallets FOR ALL 
  USING (auth.uid() = user_id);
```

### 4. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── wallet/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── auth/
│   │   ├── ui/
│   │   └── wallet/
│   └── lib/
│       ├── blockchain/
│       ├── supabase/
│       └── utils/
├── .env
├── .env.local (not in repo - you need to create this)
├── package.json
└── README.md
```

## Security Considerations

- Private keys and recovery phrases are encrypted before being stored in the database
- Users must enter their password to view sensitive wallet information
- Supabase Row Level Security ensures users can only access their own data
- HTTPS should be used in production to secure all communications

## Deployment

This application can be easily deployed to Vercel:

```bash
npm run build
```

Follow the deployment instructions for your preferred hosting platform.

## License

MIT
