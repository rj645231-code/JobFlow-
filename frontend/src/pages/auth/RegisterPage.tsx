import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Zap, LayoutDashboard, Target } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0f1117]">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-tr from-purple-950 via-[#0f1117] to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg shadow-purple-500/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">JobFlow</h1>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Start your journey.
          </h2>
          <p className="text-lg text-white/60 mb-12">
            Join thousands of professionals landing offers faster with JobFlow.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/80">
              <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <span>Target Top Companies</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <LayoutDashboard className="w-5 h-5 text-purple-400" />
              </div>
              <span>Beautiful Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your details to get started
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-black/20 border-white/10 focus-visible:ring-purple-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" className="bg-black/20 border-white/10 focus-visible:ring-purple-500" {...field} />
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
                        <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10 focus-visible:ring-purple-500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-500/25">
                  Create Account
                </Button>
              </form>
            </Form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
