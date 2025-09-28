import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRightLeft, CheckCircle2, Download, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { Toaster, toast } from '@/components/ui/sonner';
type TranslationState = 'idle' | 'uploading' | 'translating' | 'success' | 'error';
type Language = 'en-id' | 'id-en';
export function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<Language>('en-id');
  const [translationState, setTranslationState] = useState<TranslationState>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    // Revoke the object URL to avoid memory leaks when the component unmounts or the URL changes
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (translationState !== 'idle' && translationState !== 'uploading') {
      resetState();
    }
  };
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en-id' ? 'id-en' : 'en-id'));
  };
  const resetState = () => {
    setTranslationState('idle');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setErrorMessage('');
  };
  const handleTranslate = async () => {
    if (!file) return;
    resetState(); // Reset previous results before starting a new translation
    setTranslationState('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('direction', language);
    try {
      setTranslationState('translating');
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        // Try to parse error JSON from the server, with a fallback
        const errorResult = await response.json().catch(() => ({ error: `Request failed with status: ${response.status}` }));
        throw new Error(errorResult.error || 'An unknown error occurred during translation.');
      }
      // The backend now returns the file directly
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setTranslationState('success');
      toast.success('Translation successful!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to translate the document.';
      setErrorMessage(message);
      setTranslationState('error');
      toast.error('Translation Failed', { description: message });
    }
  };
  const isProcessing = translationState === 'uploading' || translationState === 'translating';
  const getStatusMessage = () => {
    switch (translationState) {
      case 'uploading': return 'Uploading file...';
      case 'translating': return 'Translating document...';
      case 'success': return 'Translation complete!';
      case 'error': return 'An error occurred.';
      default: return '';
    }
  };
  const StatusIcon = () => {
    switch (translationState) {
      case 'uploading':
      case 'translating':
        return <Loader className="h-5 w-5 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };
  return (
    <>
      <ThemeToggle className="fixed top-6 right-6" />
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-3xl mx-auto text-center py-16 md:py-24 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-foreground">
              Lumina<span className="text-primary">Translate</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Effortless document translation between English and Indonesian, preserving your original formatting.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="w-full text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  New Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUpload file={file} onFileSelect={handleFileSelect} disabled={isProcessing} />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 font-medium">
                    <span>{language === 'en-id' ? 'English' : 'Indonesian'}</span>
                    <Button variant="ghost" size="icon" onClick={toggleLanguage} disabled={isProcessing} aria-label="Swap languages">
                      <ArrowRightLeft className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Button>
                    <span>{language === 'en-id' ? 'Indonesian' : 'English'}</span>
                  </div>
                  <Button
                    onClick={handleTranslate}
                    disabled={!file || isProcessing}
                    className="w-full sm:w-auto min-w-[140px]"
                    size="lg"
                  >
                    {isProcessing ? <Loader className="h-5 w-5 animate-spin" /> : 'Translate'}
                  </Button>
                </div>
                <AnimatePresence>
                  {translationState !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="!mt-6"
                    >
                      <div className="flex items-center justify-between p-4 rounded-md bg-muted/50">
                        <div className="flex items-center gap-3">
                          <StatusIcon />
                          <p className="font-medium text-sm">{getStatusMessage()}</p>
                        </div>
                        {translationState === 'success' && downloadUrl && file && (
                          <Button asChild size="sm">
                            <a href={downloadUrl} download={`translated_${file.name}`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                        {translationState === 'error' && (
                           <Button variant="secondary" size="sm" onClick={() => { setFile(null); resetState(); }}>
                             Try Again
                           </Button>
                        )}
                      </div>
                      {translationState === 'error' && errorMessage && (
                        <p className="text-sm text-destructive mt-2 pl-1">{errorMessage}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <footer className="absolute bottom-6 text-center text-sm text-muted-foreground/80">
          <p>Built with ❤��� at Cloudflare</p>
        </footer>
      </main>
      <Toaster richColors closeButton />
    </>
  );
}