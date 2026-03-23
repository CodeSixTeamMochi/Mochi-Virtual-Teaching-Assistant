import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Image } from 'lucide-react';
import { useAuthContext } from '@asgardeo/auth-react';
import mochiAvatar from '@/assets/mochi-avatar-gif.gif';


// TODO: Database Integration
// When connecting to PostgreSQL database:
// 1. Verify user session/token is valid
// 2. Fetch user-specific data and preferences
// 3. Load personalized dashboard content


/* ☁️ Cloud component */
const Cloud = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={className} style={style}>
    <svg viewBox="0 0 200 100" fill="white" fillOpacity="0.7" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="70" rx="50" ry="30" />
      <ellipse cx="100" cy="50" rx="55" ry="35" />
      <ellipse cx="140" cy="65" rx="45" ry="28" />
      <ellipse cx="80" cy="55" rx="40" ry="25" />
      <ellipse cx="120" cy="45" rx="35" ry="22" />
    </svg>
  </div>
);

/* ✨ Sparkle dot */
const SparkleDot = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute w-2 h-2 rounded-full bg-primary/60 animate-sparkle pointer-events-none"
    style={style}
  />
);

//const Home = () => {
 // const navigate = useNavigate();

  //useEffect(() => {
    // Check if user is authenticated
  //  const isAuthenticated = localStorage.getItem('isAuthenticated');
  //  if (!isAuthenticated) {
   //   navigate('/login');
   // }
 // }, [navigate]);

 const Home = () => {
  const navigate = useNavigate();
  const { state, getIDToken, signIn } = useAuthContext();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      signIn(); 
    }
  }, [state.isLoading, state.isAuthenticated, signIn]);

  useEffect(() => {
    const syncUser = async () => {
      if (state.isAuthenticated) {
        try {
          const token = await getIDToken();
          const response = await fetch("http://localhost:5000/api/auth/sync", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
               asgardeo_id: state.sub,
               email: state.email,
               first_name: state.displayName?.split(' ')[0] || "Mochi Guest", // Safe naming
            })
          });
          const data = await response.json();
          setUserProfile(data);
        } catch (err) {
          console.error("Sync Error:", err);
        }
      }
    };
    syncUser();
  }, [state.isAuthenticated, getIDToken, state.sub, state.email, state.displayName]);

  
  const features = [
    { id: 'visual-search', name: 'Visual Search', icon: Image },
    { id: 'Lessons', name: 'Lessons', icon: Image },
    { id: 'pronunciation', name: 'Correct Pronunciation', icon: Image },
    { id: 'dashboard', name: 'Dashboard', icon: Image },
  ];

  // TODO: Dashboard Connection
  // The Dashboard page is available at '/dashboard' route
  // To add dashboard access, use: navigate('/dashboard')
  // This can be connected via a separate navigation element (e.g., sidebar, header menu)

  const handleFeatureClick = (featureId: string) => {
    switch (featureId) {
      case "visual-search":
        navigate("/visual-search");
        break;
      case "Lessons":
        navigate("/LessonPlaneHome");
        break;
      case "pronunciation":
        navigate("/reinforced-learning");
        break;
      case "dashboard":

        navigate("/dashboard");
        break;  
      default:
        navigate("/Home");

        console.warn(`No route defined for: ${featureId}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden w-full">
      {/* Animated gradient sky background */}
      <div
        className="absolute inset-0 animate-gradient-shift -z-10"
        style={{
          background:
            'linear-gradient(135deg, hsl(205 65% 88%), hsl(210 40% 92%), hsl(210 55% 85%), hsl(200 50% 90%), hsl(205 65% 88%))',
          backgroundSize: '300% 300%',
        }}
      />

      {/* Animated clouds */}
      <Cloud className="absolute top-[8%] w-40 opacity-70 animate-drift -z-[5]" style={{ animationDuration: '28s' }} />
      <Cloud className="absolute top-[22%] w-56 opacity-50 animate-drift -z-[5]" style={{ animationDuration: '38s', animationDelay: '5s' }} />
      <Cloud className="absolute top-[55%] w-32 opacity-40 animate-drift-reverse -z-[5]" style={{ animationDuration: '34s', animationDelay: '2s' }} />
      <Cloud className="absolute top-[75%] w-48 opacity-30 animate-drift -z-[5]" style={{ animationDuration: '42s', animationDelay: '10s' }} />
      <Cloud className="absolute top-[40%] w-36 opacity-50 animate-drift-reverse -z-[5]" style={{ animationDuration: '30s', animationDelay: '8s' }} />

      {/* Sparkle particles */}
      {[
        { top: '12%', left: '15%', animationDuration: '3s', animationDelay: '0s' },
        { top: '25%', left: '80%', animationDuration: '4s', animationDelay: '1s' },
        { top: '60%', left: '10%', animationDuration: '3.5s', animationDelay: '2s' },
        { top: '45%', left: '90%', animationDuration: '2.8s', animationDelay: '0.5s' },
        { top: '80%', left: '70%', animationDuration: '3.2s', animationDelay: '1.5s' },
        { top: '15%', left: '50%', animationDuration: '4.2s', animationDelay: '3s' },
        { top: '70%', left: '35%', animationDuration: '3.8s', animationDelay: '2.5s' },
        { top: '35%', left: '60%', animationDuration: '3s', animationDelay: '1.8s' },
      ].map((s, i) => (
        <SparkleDot key={i} style={s} />
      ))}
      
      {/* Notification Bell - Top Right */}
      <div className="absolute top-6 right-6">
        <button 
        className="notification-bell"
        onClick={() => navigate('/health-data')}
        aria-label="Emergency Data"
        >
          <Bell size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - MOCHI Text & Avatar */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Vertical MOCHI Text */}
          <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2">
            <h1 className="text-primary font-bold text-6xl md:text-8xl lg:text-9xl tracking-tight" 
                style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
              MOCHI
            </h1>
          </div>

          {/* Mochi Avatar */}
          <div className="ml-24 md:ml-40 flex items-center justify-center">
            <img 
              src={mochiAvatar} 
              alt="Mochi - Virtual Teaching Assistant" 
              className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] max-w-[42vw] object-contain animate-float drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Feature Cards */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-card/50 rounded-3xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className="feature-card w-60 h-60 md:w-64 md:h-64"
                >
                  <div className="feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <span className="text-foreground font-semibold text-[1.4rem]  text-center">
                    {feature.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
