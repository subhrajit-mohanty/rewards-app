import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.push(isAuthenticated ? '/dashboard' : '/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'white' }}></div>
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'white' }}></div>
      
      <div className="relative" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <FiAward className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-white text-center mb-8">Rewards</h1>
        
        <div className="flex items-center justify-center gap-2">
          <div 
            className="w-3 h-3 rounded-full bg-white"
            style={{ animation: 'pulse 1s ease-in-out infinite' }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full bg-white"
            style={{ animation: 'pulse 1s ease-in-out 0.2s infinite' }}
          ></div>
          <div 
            className="w-3 h-3 rounded-full bg-white"
            style={{ animation: 'pulse 1s ease-in-out 0.4s infinite' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
