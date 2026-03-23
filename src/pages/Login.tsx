import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthContext } from "@asgardeo/auth-react";
import mochiMascot from '@/assets/mochi-avatar-gif.gif';
import teacherAvatar from '@/assets/teacher-avatar.png';

const Login = () => {
  const navigate = useNavigate();
  const { state, signIn } = useAuthContext();

  // 🛡️ SECURITY CHECK: 
  // If the user is already logged in and somehow lands here, send them Home immediately.
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/home');
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🚀 THE BYPASS: 
    // This ignores the username/password fields and opens the Asgardeo Login.
    signIn();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Mochi mascot */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center">
          <img 
            src={mochiMascot} 
            alt="Mochi Mascot" 
            className="w-80 h-80 object-contain mx-auto animate-float drop-shadow-2xl"
          />
          <h1 className="mt-8 text-4xl font-bold text-foreground tracking-wide">
            Mochi
          </h1>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="login-card w-full max-w-md">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <img 
              src={teacherAvatar} 
              alt="Teacher Avatar" 
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Teacher Login</h2>
            <p className="text-muted-foreground mt-1">Access your secure Mochi portal</p>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              "Click below to sign in using your secure team credentials."
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NOTE: We keep the button inside a form so it feels natural, 
               but we removed the username/password inputs because 
               Asgardeo handles those on its own secure page. 
            */}
            
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="login-button w-full flex items-center justify-center gap-2"
                disabled={state.isLoading}
              >
                <LogIn size={20} />
                {state.isLoading ? 'Connecting...' : 'Sign In with Asgardeo'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Powered by Asgardeo Cloud Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;