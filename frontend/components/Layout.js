import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiHeart, FiAward, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/vote', label: 'Vote', icon: FiHeart },
    { href: '/leaderboard', label: 'Leaderboard', icon: FiAward }
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' },
      hr: { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white' },
      leader: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' },
      employee: { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white' }
    };
    return styles[role] || styles.employee;
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      {/* Navigation */}
      <nav 
        className="sticky top-0 z-50"
        style={{ 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  <FiAward className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold" style={{ color: '#0f172a' }}>Rewards</span>
              </Link>

              <div className="hidden md:flex items-center gap-2">
                {links.map(l => {
                  const isActive = router.pathname === l.href;
                  return (
                    <Link 
                      key={l.href} 
                      href={l.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                        color: isActive ? 'white' : '#64748b',
                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                      }}
                    >
                      <l.icon className="w-4 h-4" />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl" style={{ background: '#f1f5f9' }}>
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  {getInitials(user?.name)}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold" style={{ color: '#0f172a' }}>{user?.name}</div>
                  <div 
                    className="text-xs px-2 py-0.5 rounded-full inline-block font-medium"
                    style={{ 
                      background: getRoleBadgeStyle(user?.role).bg,
                      color: getRoleBadgeStyle(user?.role).color
                    }}
                  >
                    {user?.role?.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="flex justify-around py-2">
            {links.map(l => {
              const isActive = router.pathname === l.href;
              return (
                <Link 
                  key={l.href} 
                  href={l.href}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
                  style={{
                    color: isActive ? '#6366f1' : '#94a3b8'
                  }}
                >
                  <l.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{l.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
