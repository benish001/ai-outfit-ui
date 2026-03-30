import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Splash = ({ onNext }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FF9A8B] via-[#FF6A88] to-[#A18CD1] overflow-hidden">
      
      {/* Background Decorative Particles */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-luxury/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-8 md:space-y-12 py-8">
        
        {/* Animated Brand Identity */}
        <motion.div 
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 md:w-40 md:h-40 glass-morphism rounded-[32px] md:rounded-[40px] flex items-center justify-center p-6 md:p-8 shadow-2xl"
        >
          <div className="w-full h-full text-white">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current stroke-[4]">
              <path d="M50 10V90M10 50H90M20 20L80 80M80 20L20 80" strokeWidth="2" opacity="0.3"/>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M30 40C30 30 40 20 50 20C60 20 70 30 70 40C70 50 50 70 50 70C50 70 30 50 30 40Z" 
                className="fill-white/80"
              />
            </svg>
          </div>
        </motion.div>

        <div className="text-center space-y-2 md:space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-white tracking-tight"
          >
            Tone<span className="italic font-light opacity-80">Wear</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.8 }}
             className="text-[10px] md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold text-white leading-relaxed"
          >
            Find Your Perfect Color
          </motion.p>
        </div>

        {/* CTA Card */}
        <Card variant="glass" className="w-full p-6 md:p-10 space-y-6 md:space-y-8 mt-6 md:mt-12 animate-float">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-orange-vibrant flex items-center justify-center text-white shadow-lg">
                  <Sparkles size={14} />
               </div>
               <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black text-white/90">AI Powered Analysis</span>
            </div>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-medium">
              Join 50k+ fashion enthusiasts using neural complexion analysis to elevate their personal style.
            </p>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            className="w-full bg-white text-black hover:bg-black hover:text-white group py-4 md:py-6"
            onClick={onNext}
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        <div className="pt-6 md:pt-12 opacity-30">
          <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] text-white text-center">Luxury Fashion Intelligence</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
