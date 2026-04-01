import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, CheckCircle, X, ChevronLeft, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAnalysis } from '../../context/AnalysisContext';
import api from '../../services/api';

const PhotoUpload = ({ onNext, onBack }) => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { setAnalysisResult, isAnalyzing, setIsAnalyzing, setError } = useAnalysis();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/skin-tone/analyze-skin-tone', formData);
      
      setAnalysisResult(response.data.data);
      onNext(); // Navigate forward to results
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze skin tone. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="h-[100dvh] w-full bg-[#f8f8f8] p-5 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-full space-y-8">
           <div className="space-y-4 text-center">
             <div className="w-20 h-20 bg-orange-vibrant/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="animate-spin text-orange-vibrant" size={40} />
             </div>
             <h2 className="text-2xl font-bold luxury-font">Analyzing Your Skin Tone</h2>
             <p className="text-sm text-muted">We're using AI to find your perfect color palette...</p>
           </div>
           
           <div className="space-y-4">
             <div className="h-12 bg-white rounded-2xl animate-skeleton shadow-soft" />
             <div className="h-32 bg-white rounded-[32px] animate-skeleton shadow-soft" />
             <div className="grid grid-cols-2 gap-4">
               <div className="h-24 bg-white rounded-2xl animate-skeleton shadow-soft" />
               <div className="h-24 bg-white rounded-2xl animate-skeleton shadow-soft" />
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] p-5 flex flex-col max-w-2xl mx-auto overflow-x-hidden">
      
      {/* Mini Progress/Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
         <button onClick={onBack} className="p-2 -ml-2 hover:opacity-100 opacity-40 transition-opacity">
            <ChevronLeft size={22} />
         </button>
        <div className="flex gap-2">
           <div className="w-10 h-1 rounded-full bg-orange-vibrant" />
           <div className="w-10 h-1 rounded-full bg-black/5" />
           <div className="w-10 h-1 rounded-full bg-black/5" />
        </div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      <div className="space-y-1 mb-6 shrink-0">
        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-muted">Analysis Phase</p>
        <h1 className="text-3xl md:text-5xl font-bold luxury-font leading-tight">
          Upload Your<br />
          <span className="italic text-orange-vibrant">Complexion.</span>
        </h1>
      </div>

      {/* Main Upload Area - Neumorphic Circular Preview */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-0 overflow-hidden">
        <div className="relative group">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-[#f8f8f8] shadow-neumorphic-out flex flex-col items-center justify-center cursor-pointer hover:shadow-neumorphic-in transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-orange-vibrant mb-4 group-hover:scale-110 transition-transform">
                   <Camera size={28} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-black opacity-30">Scan Face / Body</p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-64 h-64 md:w-80 md:h-80 rounded-full p-4 bg-[#f8f8f8] shadow-neumorphic-out relative"
              >
                <div className="w-full h-full rounded-full overflow-hidden shadow-inner relative ring-4 ring-white">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button onClick={removeImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30">
                        <X size={20} />
                      </button>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-green-500 border-4 border-[#f8f8f8] flex items-center justify-center text-white shadow-lg">
                  <CheckCircle size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Option Buttons */}
        <div className="w-full grid grid-cols-2 gap-4 shrink-0">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex flex-col items-center gap-2 p-5 rounded-[24px] bg-white shadow-soft transition-all border border-black/5"
           >
              <div className="w-10 h-10 rounded-full bg-[#FF9A8B]/10 flex items-center justify-center text-[#FF9A8B]">
                 <ImageIcon size={20} />
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest">Gallery</span>
           </button>
           <button 
             className="flex flex-col items-center gap-2 p-5 rounded-[24px] bg-white shadow-soft transition-all border border-black/5"
           >
              <div className="w-12 h-12 rounded-full bg-[#A18CD1]/10 flex items-center justify-center text-[#A18CD1]">
                 <Camera size={20} />
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest text-[#A18CD1]">Scanner</span>
           </button>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6 shrink-0">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full bg-gradient-to-r from-orange-vibrant to-[#FF9A8B] text-white shadow-orange-500/20 py-5"
          onClick={handleAnalyze}
          disabled={!preview || isAnalyzing}
        >
          {isAnalyzing ? "Processing..." : "Identify Palette"}
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;
