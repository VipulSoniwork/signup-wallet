# Crypto Wallet Authentication System

A secure authentication system with integrated blockchain wallet functionality. This application allows users to sign up, automatically generates an Ethereum wallet for them, and provides a secure interface to view their wallet balance, address, private key, and recovery phrase.

## Features

- **User Authentication**: Secure signup and login with email/password
- **Automatic Wallet Generation**: Creates an Ethereum wallet with a 12-word recovery phrase for each user upon registration
- **Wallet Dashboard**: View wallet address and balance in real-time
- **Secure Key Management**: Access private keys and recovery phrases with password verification
- **Modern UI**: Responsive design with smooth animations using Framer Motion

## Tech Stack

### Frontend
- **Next.js 15.3.3**: React framework with App Router for efficient server-side rendering and routing
- **React 19**: For building the user interface components
- **Framer Motion**: For smooth animations and transitions
- **Shadcn UI**: Component library for consistent and beautiful UI elements
- **TailwindCSS**: Utility-first CSS framework for styling

### Backend
- **Next.js API Routes**: Serverless functions for handling API requests
- **Supabase**: For authentication, database, and row-level security
- **ethers.js**: For Ethereum wallet generation and blockchain interactions

### Security
- **Encryption**: Private keys and recovery phrases are encrypted using strong cryptography
- **Password Verification**: Required for accessing sensitive wallet information
- **Row-Level Security**: Database rules ensure users can only access their own data

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   │   ├── login/        # User login
│   │   │   │   └── signup/       # User registration with wallet creation
│   │   │   └── wallet/           # Wallet operations
│   │   │       └── info/         # Wallet information and sensitive data access
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── dashboard/           # User dashboard
│   │   └── layout.js            # Root layout
│   ├── components/
│   │   ├── auth/                # Authentication components
│   │   ├── ui/                  # UI components from Shadcn
│   │   └── wallet/              # Wallet-related components
│   └── lib/
│       ├── blockchain/          # Blockchain utilities
│       │   └── wallet.js        # Wallet generation and operations
│       ├── supabase/            # Supabase client setup
│       └── utils.js             # Utility functions
└── public/                      # Static assets
```

## Implementation Details

### Wallet Generation

When a user signs up, the system automatically generates an Ethereum wallet using ethers.js. The wallet includes:

- A unique Ethereum address
- A private key
- A 12-word recovery phrase (mnemonic)

These sensitive details are encrypted using the user's password before being stored in the database.

### Authentication Flow

1. **Registration**: User provides email and password
2. **Wallet Creation**: System generates a wallet and encrypts sensitive data
3. **Database Storage**: User account and encrypted wallet data are stored in Supabase
4. **Login**: User authenticates with email and password
5. **Dashboard Access**: User can view their wallet information and balance

### Security Measures

- **Encrypted Storage**: Private keys and recovery phrases are never stored in plain text
- **Password Verification**: Required to decrypt and view sensitive wallet information
- **Row-Level Security**: Database policies ensure users can only access their own data
- **Server-Side Operations**: Sensitive operations are performed on the server, not in the browser

## Prerequisites

- Node.js 18.17 or later
- Supabase account (for authentication and database)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VipulSoniwork/signup-wallet.git
cd wallet-sign
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project
2. Set up the following tables:

   **Wallets Table**:
   ```sql
   create table wallets (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     wallet_address text not null,
     encrypted_private_key text not null,
     encrypted_recovery_phrase text not null,
     created_at timestamp with time zone default now()
   );
   ```

3. Set up Row Level Security (RLS) policies:
   ```sql
   -- Enable RLS
   alter table wallets enable row level security;

   -- Create policy for users to see only their own wallet
   create policy "Users can view their own wallet" on wallets
     for select using (auth.uid() = user_id);
   ```

### 4. Configure environment variables

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_KEY=your-supabase-service-role-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### User Registration
1. Navigate to `/auth/register`
2. Enter your email and password
3. Submit the form to create an account and generate a wallet

### User Login
1. Navigate to `/auth/login`
2. Enter your credentials
3. Upon successful login, you'll be redirected to the dashboard

### Viewing Wallet Information
1. On the dashboard, you can see your wallet address and balance
2. To view your private key or recovery phrase, enter your password

## Why This Approach

### Next.js and App Router
We chose Next.js with the App Router for its efficient server-side rendering capabilities and built-in API routes, which allow us to handle authentication and blockchain operations securely on the server.

### Supabase
Supabase provides a robust authentication system and database with row-level security, making it ideal for storing sensitive user data securely. The service role key allows us to bypass RLS when necessary for operations like wallet creation.

### ethers.js
Ethers.js is a complete, compact, and lightweight library for interacting with the Ethereum blockchain. It provides reliable wallet generation with proper recovery phrases and secure cryptographic operations.

### Encryption Strategy
We encrypt sensitive wallet data using the user's password, ensuring that even if the database is compromised, the attacker cannot access private keys or recovery phrases without knowing the user's password.

## Future Enhancements

- Multi-chain wallet support
- Transaction history tracking
- QR code generation for wallet addresses
- Two-factor authentication
- Mobile app version

## License

MIT

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
