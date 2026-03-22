// import { Link } from 'react-router-dom';
// import { LogIn, Sparkles } from 'lucide-react';
// import mochiMascot from '@/assets/mochi-mascot.jpeg';


// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
//       {/* Hero Section */}
//       <div className="text-center max-w-2xl">
//         {/* Mascot */}
//         <img 
//           src={mochiMascot} 
//           alt="Mochi - Virtual Teaching Assistant" 
//           className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto animate-float drop-shadow-2xl mb-8"
//         />
        
//         {/* Title */}
//         <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
//           Welcome to <span className="text-primary">Mochi</span>
//         </h1>
        
//         {/* Subtitle */}
//         <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
//           Your Virtual Teaching Assistant for Early Childhood Education. 
//           Empowering teachers with AI-powered lesson planning and student support.
//         </p>

//         {/* Feature highlights */}
//         <div className="flex flex-wrap justify-center gap-3 mb-10">
//           <span className="inline-flex items-center gap-1 px-4 py-2 bg-secondary rounded-full text-sm text-foreground">
//             <Sparkles size={16} className="text-primary" />
//             AI-Powered
//           </span>
//           <span className="inline-flex items-center gap-1 px-4 py-2 bg-secondary rounded-full text-sm text-foreground">
//             <Sparkles size={16} className="text-primary" />
//             Lesson Planning
//           </span>
//           <span className="inline-flex items-center gap-1 px-4 py-2 bg-secondary rounded-full text-sm text-foreground">
//             <Sparkles size={16} className="text-primary" />
//             Student Tracking
//           </span>
//         </div>

//         {/* CTA Button - Login only */}
//         <div className="flex justify-center">
//           <Link to="/login" className="login-button text-lg">
//             <LogIn size={22} />
//             Teacher Login
//           </Link>
//         </div>
//       </div>

//       {/* Footer note */}
//       <p className="absolute bottom-6 text-sm text-muted-foreground">
//         Virtual Teaching Assistant for Early Childhood Education Centres
//       </p>
//     </div>
//   );
// };

// export default Index;

import { Link } from 'react-router-dom';
import { LogIn, Sparkles, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import mochiGif from '@/assets/mochi-avatar-gif.gif';

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

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
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

      {/* Hero content */}
      <main className="relative z-10 flex flex-col items-center gap-6 px-4 py-12 max-w-lg text-center">
        {/* Mascot placeholder — replace src with your GIF when ready */}
        <div className="animate-gentle-pulse rounded-full p-2">
            <img src={mochiGif} alt="Mochi mascot" className="w-100 h-100 rounded-full object-cover" />         
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ textShadow: '0 2px 12px hsl(330 60% 85% / 0.5)' }}
        >
          Welcome to <span className="text-primary">Mochi</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
          Your Virtual Teaching Assistant for Early Childhood Education.
          Empowering teachers with AI-powered lesson planning and student support.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered
          </Badge>
          <Badge className="gap-1.5 px-3 py-1.5 text-sm rounded-full bg-accent text-accent-foreground border-0">
            <BookOpen className="w-3.5 h-3.5" /> Lesson Planning
          </Badge>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm rounded-full">
            <Users className="w-3.5 h-3.5" /> Student Tracking
          </Badge>
        </div>

        {/* Login button */}
        <Link to="/login">
          <Button
            size="lg"
            className="rounded-full px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-5 h-5 mr-1" />
            Teacher Login
          </Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-muted-foreground/70">
        Virtual Teaching Assistant for Early Childhood Education Centres
      </footer>
    </div>
  );
};

export default Index;
