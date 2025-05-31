
/// <reference types="vite/client" />

// Declare global gtag function for Google Analytics
interface Window {
  gtag: (command: string, target: string, params?: any) => void;
}
