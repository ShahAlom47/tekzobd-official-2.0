"use client";
import { useEffect, useState } from "react";

export default function TekzoBDInstallButton() {
  // TypeScript may not have BeforeInstallPromptEvent in the DOM lib, so define it if needed
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }
  
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // show install popup
      const choiceResult = await deferredPrompt.userChoice;
      console.log("User choice:", choiceResult.outcome);
      setDeferredPrompt(null); // clear after user action
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      disabled={!deferredPrompt}
      className="btn- text-brandPrimary"
    >
       Install App
    </button>
  );
}
