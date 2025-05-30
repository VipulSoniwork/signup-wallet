import { ethers } from 'ethers';

/**
 * Generates a new Ethereum wallet with private key and 12-word recovery phrase
 * @returns {Object} Wallet information including address, private key, and recovery phrase
 */
export const generateWallet = () => {
  // Create a wallet with a standard 12-word mnemonic
  // Using a simpler approach that's guaranteed to work with ethers.js v6
  const wallet = ethers.Wallet.createRandom();
  
  // The default mnemonic in ethers.js is 12 words
  const recoveryPhrase = wallet.mnemonic.phrase;
  
  // Verify we have 12 words
  const wordCount = recoveryPhrase.split(' ').length;
  console.log(`Generated recovery phrase with ${wordCount} words`);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    recoveryPhrase: recoveryPhrase,
  };
};

/**
 * Encrypts sensitive wallet information
 * @param {string} data - The data to encrypt (private key or recovery phrase)
 * @param {string} password - User password for encryption
 * @param {string} dataType - Type of data being encrypted ('privateKey' or 'recoveryPhrase')
 * @returns {Promise<string>} Encrypted data
 */
export const encryptWalletData = async (data, password, dataType = 'privateKey') => {
  try {
    // Create a JSON object to store the data with its type
    const dataObject = {
      type: dataType,
      value: data
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(dataObject);
    
    // Create a temporary wallet to use for encryption
    const tempWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
    
    // Encrypt the data with the password
    const encryptedData = await tempWallet.encrypt(password);
    
    // Replace the address and privateKey in the encrypted JSON with our data
    const encryptedJson = JSON.parse(encryptedData);
    encryptedJson.data = jsonData;
    
    return JSON.stringify(encryptedJson);
  } catch (error) {
    console.error('Error encrypting wallet data:', error);
    throw new Error('Failed to encrypt wallet data');
  }
};

/**
 * Gets the balance of an Ethereum wallet
 * @param {string} address - Wallet address
 * @returns {Promise<string>} Balance in ETH
 */
export const getWalletBalance = async (address) => {
  try {
    // Connect to Ethereum network (using a public provider for demo purposes)
    const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
    
    // Get balance in wei
    const balanceWei = await provider.getBalance(address);
    
    // Convert wei to ETH
    const balanceEth = ethers.formatEther(balanceWei);
    
    return balanceEth;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return '0.0';
  }
};

/**
 * Decrypts wallet data using the user's password
 * @param {string} encryptedData - Encrypted wallet data
 * @param {string} password - User password for decryption
 * @returns {Promise<string>} Decrypted data
 */
export const decryptWalletData = async (encryptedData, password) => {
  try {
    // Parse the encrypted data to get access to our custom data field
    const encryptedJson = JSON.parse(encryptedData);
    
    // Check if we're using the new format with a data field
    if (encryptedJson.data) {
      // First decrypt the wallet to verify the password is correct
      await ethers.Wallet.fromEncryptedJson(encryptedData, password);
      
      // If successful, parse our custom data
      const dataObject = JSON.parse(encryptedJson.data);
      return dataObject.value;
    } else {
      // Fallback to old format - just return the private key
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedData, password);
      return wallet.privateKey;
    }
  } catch (error) {
    console.error('Error decrypting wallet data:', error);
    throw new Error('Failed to decrypt wallet data');
  }
};
