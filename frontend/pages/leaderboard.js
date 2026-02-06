import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { FiAward, FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function Leaderboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      api.get('/dashboard/leaderboard')
        .then(r => setData(r.data.leaderboard || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) return null;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return {
      bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      shadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
      badge: '🥇',
      color: '#78350f'
    };
    if (rank === 2) return {
      bg: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
      shadow: '0 8px 25px rgba(148, 163, 184, 0.3)',
      badge: '🥈',
      color: '#334155'
    };
    if (rank === 3) return {
      bg: 'linear-gradient(135deg, #fdba74, #ea580c)',
      shadow: '0 8px 25px rgba(234, 88, 12, 0.3)',
      badge: '🥉',
      color: '#7c2d12'
    };
    return {
      bg: '#f1f5f9',
      shadow: 'none',
      badge: null,
      color: '#64748b'
    };
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #6366f1, #4f46e5)',
      'linear-gradient(135deg, #ec4899, #db2777)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'linear-gradient(135deg, #06b6d4, #0891b2)',
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const totalVotes = data.reduce((sum, e) => sum + e.votes_received, 0);
  const totalEarnings = data.reduce((sum, e) => sum + e.earnings, 0);

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
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              🏆 Leaderboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Top performers recognized this month
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>{data.length}</div>
                <div className="text-sm" style={{ color: '#64748b' }}>Recognized</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>{totalVotes}</div>
                <div className="text-sm" style={{ color: '#64748b' }}>Total Votes</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#0f172a' }}>₹{totalEarnings}</div>
                <div className="text-sm" style={{ color: '#64748b' }}>Rewards Given</div>
              </div>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)' }}>
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>No Recognitions Yet</h3>
              <p style={{ color: '#64748b' }}>Be the first to recognize a colleague this month!</p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {data.length >= 3 && (
                <div className="hidden md:flex justify-center items-end gap-4 mb-8">
                  {[data[1], data[0], data[2]].map((entry, i) => {
                    const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                    const rankStyle = getRankStyle(actualRank);
                    const heights = ['h-32', 'h-40', 'h-24'];
                    
                    return (
                      <div 
                        key={entry.user_id} 
                        className="flex flex-col items-center"
                        style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
                      >
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-3"
                          style={{ background: getAvatarColor(entry.name), boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' }}
                        >
                          {getInitials(entry.name)}
                        </div>
                        <div className="font-semibold text-center mb-1" style={{ color: '#0f172a' }}>{entry.name}</div>
                        <div className="text-sm mb-3" style={{ color: '#64748b' }}>{entry.votes_received} votes</div>
                        <div 
                          className={`w-28 ${heights[i]} rounded-t-2xl flex items-start justify-center pt-4`}
                          style={{ 
                            background: rankStyle.bg,
                            boxShadow: rankStyle.shadow
                          }}
                        >
                          <span className="text-4xl">{rankStyle.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full List */}
              <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                {data.map((entry, i) => {
                  const rankStyle = getRankStyle(entry.rank);
                  const isCurrentUser = entry.email === user?.email;
                  
                  return (
                    <div
                      key={entry.user_id}
                      className="flex items-center gap-4 p-5 transition-all duration-300 hover:bg-gray-50"
                      style={{ 
                        borderBottom: i < data.length - 1 ? '1px solid #f1f5f9' : 'none',
                        background: isCurrentUser ? 'rgba(99, 102, 241, 0.03)' : 'transparent',
                        animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`
                      }}
                    >
                      {/* Rank */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
                        style={{ 
                          background: rankStyle.bg,
                          color: rankStyle.color,
                          boxShadow: entry.rank <= 3 ? rankStyle.shadow : 'none'
                        }}
                      >
                        {rankStyle.badge || entry.rank}
                      </div>

                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ background: getAvatarColor(entry.name) }}
                      >
                        {getInitials(entry.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate" style={{ color: '#0f172a' }}>{entry.name}</span>
                          {isCurrentUser && (
                            <span 
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white' }}
                            >
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm" style={{ color: '#64748b' }}>{entry.group}</div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="font-bold text-lg" style={{ color: '#6366f1' }}>
                          {entry.votes_received} votes
                        </div>
                        <div className="text-sm font-medium" style={{ color: '#10b981' }}>
                          ₹{entry.earnings}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
