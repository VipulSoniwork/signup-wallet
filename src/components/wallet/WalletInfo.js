"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Import UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function WalletInfo() {
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchWalletInfo(parsedUser.id);
    } else {
      // Redirect to login if no user data is found
      window.location.href = '/auth/login';
    }
  }, []);

  const fetchWalletInfo = async (userId) => {
    try {
      const response = await fetch(`/api/wallet/info?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallet information');
      }

      setWalletInfo(data);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealSensitiveData = async (dataType) => {
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsRevealing(true);

    try {
      const response = await fetch('/api/wallet/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          password,
          dataType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reveal sensitive data');
      }

      if (dataType === 'privateKey') {
        setPrivateKey(data.privateKey);
        setShowPrivateKey(true);
      } else {
        setRecoveryPhrase(data.recoveryPhrase);
        setShowRecoveryPhrase(true);
      }

      // Clear password field
      setPassword('');
    } catch (error) {
      console.error('Error revealing sensitive data:', error);
      toast.error(error.message);
    } finally {
      setIsRevealing(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} copied to clipboard`))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
            <CardDescription>Your Ethereum wallet details and balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">SID</div>
              <div className="flex items-center space-x-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {walletInfo?.walletAddress}
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(walletInfo?.walletAddress, 'Wallet address')}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Balance</div>
              <div className="text-2xl font-bold">{walletInfo?.balance} ETH</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Sensitive Information</CardTitle>
            <CardDescription>
              Access your private key and recovery phrase. Never share these with anyone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Enter your password to reveal sensitive data
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => handleRevealSensitiveData('privateKey')}
                disabled={isRevealing}
                className="flex-1"
              >
                {isRevealing ? 'Revealing...' : 'Reveal Private Key'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRevealSensitiveData('recoveryPhrase')}
                disabled={isRevealing}
                className="flex-1"
              >
                {isRevealing ? 'Revealing...' : 'Reveal Recovery Phrase'}
              </Button>
            </div>

            {showPrivateKey && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Private Key</div>
                <div className="relative">
                  <code className="block w-full p-2 rounded bg-muted font-mono text-xs break-all">
                    {privateKey}
                  </code>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(privateKey, 'Private key')}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Warning: Never share your private key with anyone. Anyone with access to your private key has complete control over your wallet.
                </p>
              </div>
            )}

            {showRecoveryPhrase && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Recovery Phrase</div>
                <div className="relative">
                  <code className="block w-full p-2 rounded bg-muted font-mono text-xs">
                    {recoveryPhrase}
                  </code>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(recoveryPhrase, 'Recovery phrase')}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Warning: Store your recovery phrase in a secure location. It can be used to restore access to your wallet if you lose your password.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowPrivateKey(false);
                setShowRecoveryPhrase(false);
                setPrivateKey('');
                setRecoveryPhrase('');
              }}
              className={!showPrivateKey && !showRecoveryPhrase ? 'hidden' : ''}
            >
              Hide Sensitive Data
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
