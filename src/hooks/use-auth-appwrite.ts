import { useState, useEffect, createContext, useContext } from 'react';
import { account } from '@/lib/appwrite';
import { profilesHelpers } from '@/lib/appwrite-helpers';

interface User {
  $id: string;
  email: string;
  name: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context.user && !context.loading && !context.login) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await account.get();
      const profile = await profilesHelpers.getById(session.$id).catch(() => null);
      
      setUser({
        $id: session.$id,
        email: session.email,
        name: session.name,
        profile
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    await checkAuth();
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await account.create('unique()', email, password, name);
    
    // Create profile
    await profilesHelpers.create(response.$id, {
      email,
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || '',
      role: 'user',
      isActive: true,
      isPro: false
    });

    await login(email, password);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}