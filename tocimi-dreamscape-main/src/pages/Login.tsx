import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    navigate('/guest');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login berhasil');
      navigate('/admin');
    } catch (error) {
      toast.error('Login gagal. Periksa email dan password.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">TOCIMI</h1>
          <p className="text-muted-foreground">Fashion & Beauty Store</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Masuk ke Akun</CardTitle>
            <CardDescription>
              Pilih cara masuk ke dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAdminLogin ? (
              <div className="space-y-4">
                <Button
                  onClick={handleGuestLogin}
                  className="w-full"
                  size="lg"
                >
                  Masuk sebagai Guest
                </Button>
                <Button
                  onClick={() => setIsAdminLogin(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Masuk sebagai Admin
                </Button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Login Admin
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsAdminLogin(false)}
                  variant="outline"
                  className="w-full"
                >
                  Kembali
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
