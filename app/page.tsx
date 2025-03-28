'use client';

import { useEffect, useState } from 'react';
import { useWeb3 } from './context/Web3Context';
import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';

export default function Home() {
  const { account, connectWallet, disconnectWallet, isActive, activateAccount, getReferrals, getEarnings, chainId } = useWeb3();
  const [referrer, setReferrer] = useState('');
  const [referrals, setReferrals] = useState<string[]>([]);
  const [earnings, setEarnings] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccount = localStorage.getItem('account');
      if (storedAccount) {
        connectWallet().catch(() => localStorage.removeItem('account'));
      }

      const storedReferrer = localStorage.getItem('referrer');
      if (storedReferrer) {
        setReferrer(storedReferrer);
        localStorage.removeItem('referrer');
      }
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem('account', account);
      loadUserData();
    } else {
      localStorage.removeItem('account');
    }
  }, [account]);

  const loadUserData = async () => {
    if (account) {
      try {
        const userReferrals = await getReferrals();
        const userEarnings = await getEarnings();
        setReferrals(userReferrals);
        setEarnings(userEarnings);
      } catch (error) {
        setError('Failed to load user data. Please try again.');
      }
    }
  };

  const handleActivation = async () => {
    setLoading(true);
    setError(null);
    try {
      await activateAccount(referrer || undefined);
      await loadUserData();
    } catch (error: any) {
      setError(error.message || 'Failed to activate account. Please try again.');
    }
    setLoading(false);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet.');
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      disconnectWallet();
      localStorage.removeItem('account');
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect wallet.') ;
    }
  };

  const copyReferralLink = async () => {
    const link = `${window.location.origin}/ref/${account}`;
    try {
      await navigator.clipboard.writeText(link);
      alert('Referral link copied to clipboard!');
    } catch {
      setError('Failed to copy link to clipboard.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <nav className="flex justify-between items-center mb-12">
        <div className="text-2xl font-bold">MLM DApp</div>
        {account ? (
          <button
            onClick={handleDisconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </nav>

      {error && (
        <div className="max-w-4xl mx-auto mb-8">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      {account && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="mb-2">Address: {account}</p>
            <p className="mb-2">Status: {isActive ? 'Active' : 'Inactive'}</p>
            <p className="mb-2">Earnings: {earnings} BNB</p>
            <p className="mb-2">Network: {chainId || 'Unknown'}</p>
          </div>

          {!isActive && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Activate Account</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Referrer Address {referrer && '(Pre-filled from referral link)'}
                </label>
                <input
                  type="text"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleActivation}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loading />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Activate Account (0.1 BNB)'
                )}
              </button>
            </div>
          )}

          {isActive && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
              {referrals.length > 0 ? (
                <ul className="space-y-2">
                  {referrals.map((referral, index) => (
                    <li key={index} className="bg-gray-700 p-3 rounded">
                      {referral}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No referrals yet</p>
              )}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Share Your Referral Link</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-700 p-3 rounded break-all flex-1">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${account}`}
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
