import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { FiCheck, FiSend, FiUser, FiSearch, FiHeart, FiX } from 'react-icons/fi';

export default function Vote() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [remaining, setRemaining] = useState(4);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (search) {
      setFiltered(users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.group.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFiltered(users);
    }
  }, [search, users]);

  const loadData = async () => {
    try {
      const [u, v] = await Promise.all([
        api.get('/vote/eligible-recipients'),
        api.get('/vote/my')
      ]);
      setUsers(u.data.users);
      setFiltered(u.data.users);
      setRemaining(v.data.remaining_votes);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/vote', { to_user: selected._id, message });
      toast.success(`You recognized ${selected.name}! 🎉`);
      setSelected(null);
      setMessage('');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
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

  if (authLoading || !isAuthenticated) return null;

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 rounded-full" style={{ borderColor: '#e2e8f0', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                Recognize a Colleague
              </h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Show appreciation for someone who made a difference
              </p>
            </div>
            
            <div 
              className="flex items-center gap-3 px-5 py-3 rounded-2xl"
              style={{ 
                background: remaining > 0 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#94a3b8',
                boxShadow: remaining > 0 ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <FiHeart className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg">{remaining}</span>
              <span className="text-white/80 text-sm">votes left</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* User Selection */}
            <div className="lg:col-span-2">
              {/* Search */}
              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or team..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-base transition-all duration-300 bg-white"
                  style={{ 
                    border: '2px solid #e2e8f0',
                    outline: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Users Grid */}
              <div className="grid sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {filtered.map((u, i) => {
                  const isSelected = selected?._id === u._id;
                  const isDisabled = u.already_voted || remaining === 0;
                  
                  return (
                    <div
                      key={u._id}
                      onClick={() => !isDisabled && setSelected(u)}
                      className="relative p-5 rounded-2xl cursor-pointer transition-all duration-300"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))' : 
                                   u.already_voted ? 'rgba(16, 185, 129, 0.05)' : 'white',
                        border: `2px solid ${isSelected ? '#6366f1' : u.already_voted ? '#10b981' : '#e2e8f0'}`,
                        opacity: isDisabled && !u.already_voted ? 0.5 : 1,
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? '0 8px 25px rgba(99, 102, 241, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
                        animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`
                      }}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div 
                          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                        >
                          <FiCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Voted indicator */}
                      {u.already_voted && (
                        <div 
                          className="absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                        >
                          <FiCheck className="w-3 h-3" />
                          Voted
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                          style={{ background: getAvatarColor(u.name) }}
                        >
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-lg" style={{ color: '#0f172a' }}>{u.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span 
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: '#f1f5f9', color: '#64748b' }}
                            >
                              {u.group}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <FiSearch className="w-12 h-12 mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                  <p style={{ color: '#64748b' }}>No colleagues found matching "{search}"</p>
                </div>
              )}
            </div>

            {/* Vote Panel */}
            <div className="lg:col-span-1">
              <div 
                className="sticky top-24 bg-white rounded-3xl p-6 transition-all duration-500"
                style={{ 
                  boxShadow: selected ? '0 20px 40px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: selected ? '2px solid #6366f1' : '2px solid transparent'
                }}
              >
                {selected ? (
                  <div style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                    {/* Selected User */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ background: getAvatarColor(selected.name) }}
                        >
                          {getInitials(selected.name)}
                        </div>
                        <div>
                          <div className="font-semibold" style={{ color: '#0f172a' }}>{selected.name}</div>
                          <div className="text-sm" style={{ color: '#64748b' }}>{selected.group}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelected(null)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: '#f1f5f9', color: '#64748b' }}
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>
                        Add a message (optional)
                      </label>
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="What did they do that was awesome?"
                        rows={4}
                        className="w-full p-4 rounded-xl text-base transition-all duration-300 resize-none"
                        style={{ 
                          border: '2px solid #e2e8f0',
                          outline: 'none',
                          background: '#f8fafc'
                        }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleVote}
                      disabled={submitting}
                      className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.5)',
                        opacity: submitting ? 0.7 : 1
                      }}
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }}></div>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          Send Recognition
                        </>
                      )}
                    </button>

                    <p className="text-center text-sm mt-4" style={{ color: '#94a3b8' }}>
                      This will award {selected.name} ₹100
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: '#f1f5f9' }}
                    >
                      <FiUser className="w-10 h-10" style={{ color: '#cbd5e1' }} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: '#0f172a' }}>Select a Colleague</h3>
                    <p style={{ color: '#94a3b8' }}>
                      Choose someone from the list to recognize their contribution
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
