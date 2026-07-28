import { } from 'react';

export function useSystemSound() {
  const playSound = (soundFile: string, volume = 0.4) => {
    const audio = new Audio(`/assets/sounds/${soundFile}`);
    audio.volume = volume;
    audio.play().catch(() => {
      // Silently fail if browser blocks autoplay
    });
  };

  return {
    playClick: () => playSound('startup.mp3', 0.2), // Using startup as fallback for clicks since we only have one file
    playOpen: () => playSound('startup.mp3', 0.3),
    playClose: () => playSound('startup.mp3', 0.2),
  };
}
