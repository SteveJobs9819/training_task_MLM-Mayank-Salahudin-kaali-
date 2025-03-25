'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../../components/Loading';

export default function ReferralPage({ params }: { params: { address: string } }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store the referrer address in localStorage
      localStorage.setItem('referrer', params.address);
      // Redirect to the main page
      router.push('/');
    }
  }, [params.address, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <Loading />
        <p className="mt-4">You are being redirected to the main page.</p>
      </div>
    </div>
  );
} 