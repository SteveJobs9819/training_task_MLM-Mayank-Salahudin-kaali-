'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner, Contract, formatEther, parseEther } from 'ethers';
import { MLM_CONTRACT_ABI, MLM_CONTRACT_ADDRESS } from '../contracts/MLMContract';

interface Web3ContextType {
  account: string | null;
  contract: Contract | null;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isActive: boolean;
  activateAccount: (referrer?: string) => Promise<void>;
  getReferrals: () => Promise<string[]>;
  getEarnings: () => Promise<string>;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  contract: null,
  provider: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isActive: false,
  activateAccount: async () => {},
  getReferrals: async () => [],
  getEarnings: async () => "0",
  chainId: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const contract = new Contract(MLM_CONTRACT_ADDRESS, MLM_CONTRACT_ABI, signer);
        const network = await provider.getNetwork();
        
        setAccount(accounts[0]);
        setProvider(provider);
        setContract(contract);
        setChainId(Number(network.chainId));
  
        // Safer check for account activation
        try {
          const active = await contract.isAccountActive(accounts[0]);
          setIsActive(active);
        } catch (activationError) {
          console.error('Error checking account activation:', activationError);
          setIsActive(false); // Default to inactive if check fails
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setIsActive(false);
    setChainId(null);
  };

  const activateAccount = async (referrer?: string) => {
    if (!contract) return;
    try {
      const activationFee = parseEther('0.1'); // 0.1 BNB activation fee
      if (referrer) {
        await contract.activateAccountWithReferrer(referrer, { value: activationFee });
      } else {
        await contract.activateAccount({ value: activationFee });
      }
      setIsActive(true);
    } catch (error) {
      console.error('Error activating account:', error);
      throw error;
    }
  };

  const getReferrals = async (): Promise<string[]> => {
    if (!contract || !account) return [];
    try {
      return await contract.getReferrals(account);
    } catch (error) {
      console.error('Error getting referrals:', error);
      return [];
    }
  };

  const getEarnings = async (): Promise<string> => {
    if (!contract || !account) return "0";
    try {
      const earnings = await contract.getEarnings(account);
      return formatEther(earnings);
    } catch (error) {
      console.error('Error getting earnings:', error);
      return "0";
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(parseInt(newChainId, 16));
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        contract,
        provider,
        connectWallet,
        disconnectWallet,
        isActive,
        activateAccount,
        getReferrals,
        getEarnings,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context); 