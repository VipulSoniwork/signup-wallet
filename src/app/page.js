"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Crypto Wallet Authentication
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Create an account, get your own Ethereum wallet, and manage your crypto assets securely.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            Key Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-background p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Create an account with email and password, with secure session management and password recovery.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">Automatic Wallet Creation</h3>
              <p className="text-muted-foreground">
                Get your own Ethereum wallet automatically generated when you sign up, with secure key storage.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background p-6 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">Wallet Management</h3>
              <p className="text-muted-foreground">
                View your wallet balance, access your private key and recovery phrase securely.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Crypto Wallet Authentication. All rights reserved.</p>
      </footer>
    </div>
  );
}
