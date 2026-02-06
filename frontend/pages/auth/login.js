import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FiAward, title: 'Recognize Excellence', desc: 'Appreciate your colleagues' },
    { icon: FiUsers, title: '4 Votes Monthly', desc: 'Each vote = ₹100 reward' },
    { icon: FiTrendingUp, title: 'Track Impact', desc: 'See the leaderboard' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'white' }}></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'white' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: 'white' }}></div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <FiAward className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Rewards</span>
            </div>
            
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Celebrate Your<br />Team's Success
            </h1>
            
            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              A simple way to recognize and reward<br />the amazing people you work with.
            </p>
            
            <div className="space-y-6">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4"
                  style={{ animation: `fadeInUp 0.6s ease-out ${0.2 + i * 0.1}s both` }}
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <div className="text-sm opacity-75">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="w-full max-w-md" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#0f172a' }}>Rewards</span>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>Welcome back</h2>
              <p style={{ color: '#64748b' }}>Sign in to continue to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all duration-300"
                    style={{ 
                      border: '2px solid #e2e8f0',
                      outline: 'none',
                      background: 'white'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="admin@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94a3b8' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-base transition-all duration-300"
                    style={{ 
                      border: '2px solid #e2e8f0',
                      outline: 'none',
                      background: 'white'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.5)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin 0.8s linear infinite' }}></div>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo credentials card */}
          <div className="mt-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                <FiUsers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold mb-1" style={{ color: '#4f46e5' }}>Demo Credentials</div>
                <div className="text-sm space-y-1" style={{ color: '#64748b' }}>
                  <div><span className="font-medium">Email:</span> admin@company.com</div>
                  <div><span className="font-medium">Password:</span> admin123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
