import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 text-gray-900 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="w-full bg-white bg-opacity-70 backdrop-blur-md shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-50">
        <h2 className="text-2xl font-bold text-blue-800">Yoga Recommender</h2>

      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-40 px-4 pb-24 animate-fade-in">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-blue-800 drop-shadow-xl mb-6 text-center animate-fade-in">
          🌟 AI-Powered Yoga Assistant 🌟
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-900 mb-10 text-center max-w-3xl leading-relaxed animate-slide-up">
          Improve your flexibility, posture, and well-being with AI-driven yoga guidance. 
          Enjoy personalized recommendations and real-time posture correction powered by smart technology.
        </p>

        {/* Buttons Section */}
        
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-24 left-10 w-20 h-20 bg-yellow-100 rounded-full animate-bounce-slow opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rounded-full animate-pulse-slow opacity-40"></div>

      {/* Decorative Footer Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-200 to-transparent"></div>
    </div>
  );
};

export default Home;
