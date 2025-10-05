'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

export default function AnimatedHomepage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div
          className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            top: '50%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        />
        <div
          className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            bottom: '10%',
            left: '50%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 animate-fade-in">
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            YourBrand
          </span>
        </div>
        <div className="flex items-center space-x-8 animate-fade-in-delayed">
          <a href="/dashboard" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div
          className="text-center space-y-8"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <div className="inline-block animate-float">
            <div className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm">
              ✨ Welcome to the Future
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Build Something
            </span>
            <br />
            <span className="text-white">Extraordinary</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Transform your ideas into reality with our cutting-edge platform.
            Experience the power of innovation at your fingertips.
          </p>

          <div className="flex items-center justify-center space-x-4 animate-fade-in-up animation-delay-400">
            <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Blazing performance', color: 'from-yellow-400 to-orange-400' },
            { icon: Shield, title: 'Secure', desc: 'Bank-level security', color: 'from-green-400 to-emerald-400' },
            { icon: TrendingUp, title: 'Scalable', desc: 'Grows with you', color: 'from-blue-400 to-purple-400' }
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${600 + i * 200}ms`, transform: `translateY(${parallaxOffset * (i + 1) * 0.1}px)` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
              <feature.icon className={`w-12 h-12 mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© 2025 YourBrand. Crafted with passion.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s backwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out backwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}