import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, CheckCircle, X, ChevronLeft, Loader2, Smartphone } from 'lucide-react';
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
      onNext();
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Failed to analyze skin tone. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen w-full bg-[#f8f8f8] p-6 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <div className="w-full space-y-12">
           <div className="space-y-6 text-center">
             <div className="w-24 h-24 bg-orange-vibrant/10 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="animate-spin text-orange-vibrant" size={48} />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black luxury-font">Analyzing Skin...</h2>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-30">Our Neural Engine is processing your photo</p>
             </div>
           </div>
           
           <div className="space-y-4 px-4 opacity-30">
             <div className="h-10 bg-black/5 rounded-full animate-pulse" />
             <div className="h-40 bg-black/5 rounded-[40px] animate-pulse" />
             <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-black/5 rounded-3xl animate-pulse" />
                <div className="h-20 bg-black/5 rounded-3xl animate-pulse" />
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8f8f8] p-6 flex flex-col justify-between max-w-2xl mx-auto overflow-x-hidden safe-area-inset">
      
      {/* Top Header Section */}
      <div className="shrink-0 space-y-8">
        <div className="flex items-center justify-between">
           <button onClick={onBack} className="p-3 bg-white rounded-full shadow-sm border border-black/5 hover:bg-black hover:text-white transition-all">
              <ChevronLeft size={20} />
           </button>
           <div className="flex gap-1.5">
              <div className="w-8 h-1 rounded-full bg-orange-vibrant" />
              <div className="w-8 h-1 rounded-full bg-black/[0.03]" />
              <div className="w-8 h-1 rounded-full bg-black/[0.03]" />
           </div>
           <div className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-luxury">Neural Phase 01</p>
          <h1 className="text-4xl md:text-6xl font-black luxury-font leading-tight">
            Neural Skin<br />
            <span className="italic text-orange-vibrant">Scanner.</span>
          </h1>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 min-h-0">
        <div className="relative mb-8">
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-56 h-56 xs:w-64 xs:h-64 md:w-80 md:h-80 rounded-full bg-[#f8f8f8] shadow-neumorphic-out flex flex-col items-center justify-center cursor-pointer transition-all duration-700 active:scale-95 group relative overflow-hidden"
              >
                <div className="h-full w-full absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-orange-vibrant mb-4 group-hover:scale-110 transition-transform">
                   <Camera size={28} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 px-6 text-center">Scan Facial Profile</span>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-56 h-56 xs:w-64 xs:h-64 md:w-80 md:h-80 rounded-full p-4 bg-[#f8f8f8] shadow-neumorphic-out relative"
              >
                <div className="w-full h-full rounded-full overflow-hidden shadow-inner relative group ring-4 ring-white">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <button onClick={removeImage} className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/40 hover:bg-red-500 hover:border-red-500 transition-all">
                        <X size={24} />
                      </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-14 h-14 rounded-full bg-green-500 border-4 border-[#f8f8f8] flex items-center justify-center text-white shadow-2xl scale-100 animate-in zoom-in-50 duration-300">
                  <CheckCircle size={24} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        {/* Small Selection Row */}
        <div className="w-full grid grid-cols-2 gap-4 max-w-sm">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white shadow-soft border border-black/5 hover:border-orange-vibrant/20 transition-all active:scale-95"
           >
              <ImageIcon size={18} className="text-orange-vibrant" />
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-800">Gallery</span>
           </button>
           <button 
             className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white shadow-soft border border-black/5 opacity-40 cursor-not-allowed"
           >
              <Smartphone size={18} />
              <span className="text-[9px] uppercase font-black tracking-widest">Scanner</span>
           </button>
        </div>
      </div>

      {/* Footer Button Section */}
      <div className="pb-8 shrink-0">
        <Button 
          variant="primary" 
          size="lg" 
          className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all duration-500 shadow-2xl ${
            !preview 
            ? 'bg-slate-200 text-slate-400 border-none' 
            : 'bg-black text-white hover:bg-orange-vibrant shadow-orange-vibrant/20 translate-y-[-4px]'
          }`}
          onClick={handleAnalyze}
          disabled={!preview || isAnalyzing}
        >
          {isAnalyzing ? "Processing Neural Profile..." : "Analyze Skin Complexion"}
        </Button>
        <p className="text-center mt-6 text-[8px] uppercase tracking-widest opacity-20 font-bold">Encrypted & Confidential Analysis</p>
      </div>

    </div>
  );
};

export default PhotoUpload;
