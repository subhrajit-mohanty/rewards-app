import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { FiSend, FiTrendingUp, FiDollarSign, FiAward, FiArrowRight, FiHeart, FiStar, FiZap } from 'react-icons/fi';

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      api.get('/dashboard/me')
        .then(r => setData(r.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) return null;

  const stats = [
    {
      label: 'Votes Cast',
      value: `${data?.currentMonth?.votes_cast || 0}`,
      subtext: 'of 4 this month',
      icon: FiSend,
      gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      shadowColor: 'rgba(99, 102, 241, 0.3)'
    },
    {
      label: 'Votes Received',
      value: data?.currentMonth?.votes_received || 0,
      subtext: 'this month',
      icon: FiHeart,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      shadowColor: 'rgba(236, 72, 153, 0.3)'
    },
    {
      label: 'Earnings',
      value: `₹${data?.currentMonth?.earnings || 0}`,
      subtext: 'this month',
      icon: FiDollarSign,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      shadowColor: 'rgba(16, 185, 129, 0.3)'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 rounded-full" style={{ borderColor: '#e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <span style={{ color: '#64748b' }}>{getGreeting()}</span>
            </div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Here's your recognition summary for this month
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className="bg-white rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  boxShadow: `0 4px 20px ${stat.shadowColor}`,
                  animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                }}
              >
                {/* Background decoration */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                  style={{ background: stat.gradient }}
                ></div>
                
                <div className="relative">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: stat.gradient, boxShadow: `0 8px 20px ${stat.shadowColor}` }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '4px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                    {stat.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Vote Card */}
            <Link href="/vote">
              <div 
                className="group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-1"
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)',
                  boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)'
                }}
              >
                {/* Animated circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-110"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-110"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
                    <FiHeart className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Recognize Someone</h3>
                  <p className="text-white/80 mb-6">
                    You have {4 - (data?.currentMonth?.votes_cast || 0)} votes remaining this month
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
                    Vote Now
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Leaderboard Card */}
            <Link href="/leaderboard">
              <div 
                className="group relative overflow-hidden rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:-translate-y-1 bg-white"
                style={{ 
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Decorative gradient */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                ></div>
                
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)' }}
                  >
                    <FiAward className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Leaderboard</h3>
                  <p style={{ color: '#64748b' }} className="mb-6">
                    See who's leading in recognition this month
                  </p>
                  
                  <div className="flex items-center gap-2 font-semibold group-hover:gap-4 transition-all duration-300" style={{ color: '#f59e0b' }}>
                    View Rankings
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Motivational Banner */}
          <div 
            className="mt-8 rounded-3xl p-8 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.1)'
            }}
          >
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              >
                <FiZap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1" style={{ color: '#0f172a' }}>
                  Recognition matters!
                </h4>
                <p style={{ color: '#64748b' }}>
                  Teams that recognize each other regularly are 21% more productive. Keep the appreciation flowing! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
