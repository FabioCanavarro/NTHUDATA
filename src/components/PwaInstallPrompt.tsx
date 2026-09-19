'use client';

import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt({
  variant = 'banner',
  onClose,
}: {
  variant?: 'banner' | 'button' | 'modal';
  onClose?: () => void;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check dismissal state in localStorage
    if (localStorage.getItem('nthu_hub_pwa_dismissed') === 'true') {
      setBannerDismissed(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback for browsers that don't trigger beforeinstallprompt automatically
      alert(
        'To install NTHU Hub on your device:\n\n• Chrome/Edge: Click the install icon in the address bar or menu.\n• Safari/iOS: Tap Share ➔ Add to Home Screen.\n• Android: Tap "Add to Home screen" in browser menu.'
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation prompt');
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('Error triggering PWA install prompt:', err);
    }
  };

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('nthu_hub_pwa_dismissed', 'true');
    if (onClose) onClose();
  };

  // Do not render anything if already installed as standalone app
  if (isStandalone && variant === 'banner') return null;

  // Button View Variant (for Header / Sidebar)
  if (variant === 'button') {
    if (isStandalone) return null;

    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-theme-primary to-theme-accent text-white font-semibold text-xs shadow-glow hover:opacity-95 transition-all group"
        title="Download / Install NTHU Hub App on your device"
      >
        <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        <span>Install App</span>
      </button>
    );
  }

  // Floating Banner Variant
  if (variant === 'banner') {
    if (bannerDismissed) return null;

    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-40 bg-theme-card/95 border border-theme-primary/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-theme-primary to-theme-accent flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-theme-text flex items-center gap-1.5">
                  Download NTHU Hub
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-theme-primary/20 text-theme-primary font-extrabold uppercase">
                    PWA App
                  </span>
                </h4>
                <p className="text-xs text-theme-muted mt-0.5 leading-relaxed">
                  Install NTHU Hub on your home screen for instant offline access to YouBike, buses, laundry & campus maps!
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install Now
                  </button>
                  <button
                    onClick={dismissBanner}
                    className="px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-card-hover border border-theme-border text-theme-muted text-xs transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={dismissBanner}
                className="text-theme-muted hover:text-theme-text p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* iOS Step-by-Step Installation Modal */}
        <AnimatePresence>
          {showIosGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
              onClick={() => setShowIosGuide(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-theme-card border border-theme-border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-theme-border pb-3">
                  <div className="flex items-center gap-2 font-bold text-base text-theme-text">
                    <Smartphone className="w-5 h-5 text-theme-primary" />
                    <span>Install on iPhone / iPad</span>
                  </div>
                  <button
                    onClick={() => setShowIosGuide(false)}
                    className="text-theme-muted hover:text-theme-text p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs text-theme-text">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-theme-bg/60 border border-theme-border/60">
                    <span className="w-6 h-6 rounded-full bg-theme-primary text-white font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <p className="pt-0.5">
                      Tap the <Share className="w-4 h-4 inline text-blue-400 mx-1" /> <strong>Share button</strong> in Safari's bottom toolbar.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-theme-bg/60 border border-theme-border/60">
                    <span className="w-6 h-6 rounded-full bg-theme-primary text-white font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <p className="pt-0.5">
                      Scroll down and select <PlusSquare className="w-4 h-4 inline text-emerald-400 mx-1" /> <strong>Add to Home Screen</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-theme-bg/60 border border-theme-border/60">
                    <span className="w-6 h-6 rounded-full bg-theme-primary text-white font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <p className="pt-0.5">
                      Tap <strong>Add</strong> in the top-right corner to launch NTHU Hub anytime from your app grid!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIosGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-theme-primary font-bold text-xs text-white shadow-glow"
                >
                  Got It!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
}
