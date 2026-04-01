import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [analysisResult, setAnalysisResultState] = useState(() => {
    const saved = localStorage.getItem('analysisResult');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved analysis result', e);
      return null;
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Custom setter that also updates localStorage
  const setAnalysisResult = (result) => {
    setAnalysisResultState(result);
    if (result) {
      localStorage.setItem('analysisResult', JSON.stringify(result));
    } else {
      localStorage.removeItem('analysisResult');
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <AnalysisContext.Provider value={{ 
      analysisResult, 
      setAnalysisResult, 
      isAnalyzing, 
      setIsAnalyzing, 
      error, 
      setError,
      clearAnalysis
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
