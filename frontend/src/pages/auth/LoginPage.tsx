import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Zap, Briefcase, Mail, Users, TrendingUp, Loader2 } from 'lucide-react';

const DEMO_EMAIL = 'demo@jobflow.com';
const DEMO_PASSWORD = 'demo1234';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(r => setTimeout(r, 800));

    if (values.email === DEMO_EMAIL && values.password === DEMO_PASSWORD) {
      // Store mock auth token
      localStorage.setItem('token', 'demo-jwt-token-jobflow');
      localStorage.setItem('jobflow-auth', JSON.stringify({
        state: {
          user: { id: '1', name: 'Demo User', email: DEMO_EMAIL, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          accessToken: 'demo-jwt-token-jobflow',
          refreshToken: 'demo-refresh-token',
          isAuthenticated: true,
        },
        version: 0,
      }));
      navigate('/');
    } else {
      setError('Invalid credentials. Use the demo credentials shown below.');
    }
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    form.setValue('email', DEMO_EMAIL);
    form.setValue('password', DEMO_PASSWORD);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: '#0f1117' }}>
      {/* Left side — Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f1117 50%, #2e1065 100%)' }}>
        
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: '#6366f1' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: '#a855f7' }} />

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">JobFlow</span>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-5 text-white">
            Land your dream job <span style={{ color: '#818cf8' }}>faster.</span>
          </h2>
          <p className="text-lg mb-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Your personal job application CRM. Track applications, automate outreach, and never miss a follow-up.
          </p>

          <div className="space-y-5">
            {[
              { icon: Briefcase, color: '#6366f1', text: 'Smart Application Tracking & Pipeline' },
              { icon: Mail, color: '#8b5cf6', text: 'Personalized Bulk Email Automation' },
              { icon: Users, color: '#06b6d4', text: 'Recruiter CRM with CSV Import' },
              { icon: TrendingUp, color: '#10b981', text: 'Analytics — Response & Offer Rates' },
            ].map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-lg" style={{ background: '#6366f1' }}>
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white">JobFlow</span>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Demo credentials banner */}
          <div className="rounded-xl p-4 border text-center"
            style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#818cf8' }}>🎯 DEMO CREDENTIALS (pre-filled)</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Email: <strong className="text-white">{DEMO_EMAIL}</strong> &nbsp;|&nbsp;
              Password: <strong className="text-white">{DEMO_PASSWORD}</strong>
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl p-8 space-y-5"
            style={{ background: 'rgba(26,29,46,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>

            {error && (
              <div className="rounded-lg p-3 text-sm text-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="demo@jobflow.com"
                          className="h-11"
                          style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-11"
                          style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 text-base font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                  ) : 'Sign in to JobFlow'}
                </Button>
              </form>
            </Form>

            <div className="relative flex items-center">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="px-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full h-11 font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ⚡ One-click Demo Login
            </Button>
          </div>

          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#818cf8' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
