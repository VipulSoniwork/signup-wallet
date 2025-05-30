import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Create Account | Crypto Wallet',
  description: 'Create a new crypto wallet account',
};

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <AuthForm type="register" />
    </div>
  );
}
