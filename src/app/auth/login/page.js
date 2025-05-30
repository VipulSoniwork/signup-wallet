import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign In | Crypto Wallet',
  description: 'Sign in to your crypto wallet account',
};

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <AuthForm type="login" />
    </div>
  );
}
