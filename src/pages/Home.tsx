import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Image } from 'lucide-react';
import mochiAvatar from '@/assets/mochi-avatar-gif.gif';


// TODO: Database Integration
// When connecting to PostgreSQL database:
// 1. Verify user session/token is valid
// 2. Fetch user-specific data and preferences
// 3. Load personalized dashboard content

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

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
    <div className="min-h-screen bg-background relative">
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
