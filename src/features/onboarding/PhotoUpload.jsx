import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle, X, ChevronLeft, Loader2, Upload, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAnalysis } from '../../context/AnalysisContext';
import api from '../../services/api';

/**
 * PhotoUpload â€” Pink-gradient background with neumorphic upload circle.
 * Includes skeleton loading state and smooth state transitions.
 */
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
      const result = response.data.data;
      setAnalysisResult(result);
      // Persist skin tone for discovery and specialized shop
      if (result.skin_tone) {
        localStorage.setItem('tonewear_skin_tone', result.skin_tone);
        localStorage.setItem('beauty_skin_tone', result.skin_tone);
      }
      onNext();
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* â”€â”€ Analyzing State â”€â”€ */
  if (isAnalyzing) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
      >
        <div className="w-full max-w-sm space-y-10 text-center">
          {/* Pulsing rose spinner */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-rose-100 animate-ping opacity-40" />
            <div className="relative w-24 h-24 rounded-full bg-white shadow-card flex items-center justify-center border border-rose-100">
              <Loader2 className="animate-spin text-rose-400" size={36} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold luxury-font text-[#1C1917]">Analysing Skinâ€¦</h2>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-rose-300">
              Neural Engine Processing
            </p>
          </div>
          {/* Skeleton placeholders */}
          <div className="space-y-4 opacity-40">
            <div className="skeleton h-10 rounded-full" />
            <div className="skeleton h-36 rounded-3xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-20 rounded-2xl" />
              <div className="skeleton h-20 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* â”€â”€ Upload State â”€â”€ */
  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col justify-between p-6 max-w-lg mx-auto overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FFF5F7 50%, #FFF7F0 100%)' }}
    >
      {/* Fixed background blobs */}
      <div className="fixed -top-20 -right-20 w-60 h-60 rounded-full bg-rose-100/60 blur-[70px] pointer-events-none" />
      <div className="fixed bottom-0 -left-10 w-56 h-56 rounded-full bg-pink-100/50 blur-[70px] pointer-events-none" />

      {/* â”€â”€ Header â”€â”€ */}
      <div className="relative z-10 pt-4 space-y-6">
        <div className="flex items-center justify-between">
          <button
            id="photo-upload-back"
            onClick={onBack}
            className="w-11 h-11 bg-white/80 rounded-full shadow-card border border-rose-100 flex items-center justify-center text-[#4B5563] hover:text-rose-500 hover:border-rose-200 transition-all backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Progress dots */}
          <div className="flex gap-2">
            <div className="w-8 h-1.5 rounded-full bg-rose-400" />
            <div className="w-8 h-1.5 rounded-full bg-rose-100" />
            <div className="w-8 h-1.5 rounded-full bg-rose-100" />
          </div>

          <div className="w-11" />
        </div>

        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.4em] font-black text-rose-300">Step 1 of 3</p>
          <h1 className="text-4xl md:text-5xl font-bold luxury-font text-[#1C1917] leading-tight">
            Upload Your<br />
            <span className="italic text-rose-400">Photo.</span>
          </h1>
        </div>
      </div>

      {/* â”€â”€ Upload Circle â”€â”€ */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-10">
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.4 }}
              onClick={() => fileInputRef.current?.click()}
              id="photo-upload-circle"
              className="w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center cursor-pointer group relative"
              style={{
                boxShadow: 'var(--shadow-neumorphic-out)',
                background: 'linear-gradient(145deg, #FFF0F3, #FFE4E6)',
              }}
            >
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-rose-200/60 group-hover:border-rose-300 transition-colors" />

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition-transform shadow-sm"
                style={{ background: 'rgba(255,255,255,0.8)' }}
              >
                <Upload size={28} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-300">
                Tap to Upload
              </span>
              <span className="text-[8px] text-rose-200 mt-1">JPG, PNG, WEBP</span>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div
                className="w-56 h-56 md:w-64 md:h-64 rounded-full p-4"
                style={{ boxShadow: 'var(--shadow-neumorphic-out)', background: 'linear-gradient(145deg, #FFF0F3, #FFE4E6)' }}
              >
                <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-inner group relative">
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm rounded-full">
                    <button
                      onClick={removeImage}
                      className="w-12 h-12 rounded-full bg-white/20 border border-white/40 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Success badge */}
              <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-xl">
                <CheckCircle size={20} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!preview && (
          <p className="mt-6 text-xs text-[#9CA3AF] text-center font-medium max-w-[200px] leading-relaxed">
            Use a clear, well-lit selfie or face photo for best results.
          </p>
        )}
      </div>

      {/* â”€â”€ Footer CTA â”€â”€ */}
      <div className="relative z-10 pb-4 space-y-3">
        <Button
          id="photo-upload-analyze"
          variant={preview ? 'rose' : 'ghost'}
          size="lg"
          className={`w-full ${!preview ? 'bg-rose-50 text-rose-200 border border-rose-100 cursor-not-allowed' : ''}`}
          onClick={handleAnalyze}
          disabled={!preview || isAnalyzing}
        >
          {isAnalyzing ? 'Processingâ€¦' : 'Analyse Skin Tone'}
          <span className="ml-1 opacity-60">â†’</span>
        </Button>

        <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest font-bold text-[#C4A0A8]">
          <ShieldCheck size={10} />
          <span>Your photo is never stored</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;

