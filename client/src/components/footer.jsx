import React from "react";

// Social icon SVGs (inline for performance and easy color control)
const socialIcons = {
  linkedin: (
    <svg width="24" height="24" fill="currentColor" className="text-teal-600 hover:text-teal-800 transition" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.062-1.867-3.062-1.868 0-2.154 1.459-2.154 2.967v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/>
    </svg>
  ),
  github: (
    <svg width="24" height="24" fill="currentColor" className="text-teal-600 hover:text-teal-800 transition" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  coffee: (
    <svg width="24" height="24" fill="currentColor" className="text-yellow-600 hover:text-yellow-700 transition" viewBox="0 0 24 24">
      <path d="M18.5 6h-13C4.224 6 4 6.224 4 6.5v7c0 2.757 2.243 5 5 5h2c2.757 0 5-2.243 5-5v-7c0-.276-.224-.5-.5-.5zm-1 7c0 2.206-1.794 4-4 4h-2c-2.206 0-4-1.794-4-4v-6h10v6zm2.5-6c.276 0 .5.224.5.5v2c0 2.206-1.794 4-4 4h-1v-1h1c1.654 0 3-1.346 3-3v-2c0-.276.224-.5.5-.5z"/>
    </svg>
  ),
  email: (
    <svg width="24" height="24" fill="currentColor" className="text-teal-600 hover:text-teal-800 transition" viewBox="0 0 24 24">
      <path d="M12 13.065l-11.99-7.065v14h24v-14l-12.01 7.065zm11.99-8.065h-23.98l11.99 7.065 11.99-7.065z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="24" height="24" fill="currentColor" className="text-green-500 hover:text-green-700 transition" viewBox="0 0 32 32">
      <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.263.6 4.474 1.74 6.41l-1.84 6.73 6.9-1.81c1.87 1.02 3.97 1.56 6.1 1.56h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06-2.42-2.42-5.64-3.73-9.06-3.73zm0 23.2c-1.91 0-3.79-.5-5.44-1.44l-.39-.23-4.09 1.07 1.09-4.01-.25-.41c-1.08-1.77-1.65-3.81-1.65-5.92 0-6.07 4.93-11 11-11 2.94 0 5.7 1.15 7.78 3.22 2.08 2.08 3.22 4.84 3.22 7.78 0 6.07-4.93 11-11 11zm6.01-8.29c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.17-1.39-.51-2.65-1.62-.98-.87-1.64-1.94-1.83-2.27-.19-.33-.02-.5.15-.66.16-.16.33-.38.5-.57.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.09-.17-.74-1.78-1.01-2.44-.27-.65-.54-.56-.74-.57-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.89.41-.3.33-1.17 1.14-1.17 2.77 0 1.63 1.19 3.2 1.36 3.42.17.22 2.34 3.58 5.68 4.88.79.34 1.41.54 1.89.69.79.25 1.51.22 2.08.13.64-.1 1.95-.8 2.23-1.57.28-.77.28-1.43.2-1.57-.08-.14-.3-.22-.63-.39z"/>
    </svg>
  ),
};

const socials = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/davindicator/",
    icon: socialIcons.linkedin,
  },
  {
    name: "GitHub",
    url: "https://github.com/DavinDicator001",
    icon: socialIcons.github,
  },
  {
    name: "Buy Me a Coffee",
    url: "/support-me",
    icon: socialIcons.coffee,
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/2349051217349",
    icon: socialIcons.whatsapp,
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-teal-700 text-white pt-10 pb-4 px-4 md:px-16 mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left: Brand & Links */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">NewsFlashLatest</h2>
          <nav className="flex flex-wrap gap-4 mb-2">
            <a href="/" className="hover:underline hover:text-teal-200 transition">Home</a>
            <a href="/support-me" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-yellow-300 flex items-center gap-1 transition">
              {socialIcons.coffee}
              Buy Me a Coffee
            </a>
            <a href="mailto:victorakande090@gmail.com" className="hover:underline hover:text-teal-200 flex items-center gap-1 transition">
              {socialIcons.email}
              Contact the Developer
            </a>
          </nav>
          <div className="flex gap-4 mt-2">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="p-1 rounded-full bg-white bg-opacity-10 hover:bg-opacity-30 transition"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        {/* Right: Developer credit */}
        <div className="flex flex-col items-end w-full md:w-auto">
          <span className="text-xs text-teal-200 mb-2">&copy; {new Date().getFullYear()} NewsFlashLatest. All rights reserved.</span>
          <div className="relative flex items-center">
            <span className="text-xs text-white mr-2">Developed by</span>
            <span className="relative">
              <span className="font-bold text-yellow-300 animate-pulse drop-shadow-lg">DavinDicator</span>
              {/* Animated underline */}
              <span className="absolute left-0 right-0 -bottom-1 h-1 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 rounded-full animate-pulse" style={{ opacity: 0.7 }}></span>
            </span>
          </div>
        </div>
      </div>
      {/* Bottom right floating developer badge */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none select-none">
        <span className="bg-white bg-opacity-80 text-teal-700 font-bold px-4 py-1 rounded-full shadow-lg animate-fadeInOut border-2 border-yellow-300">
          <span className="animate-pulse">Developed by DavinDicator 🚀</span>
        </span>
      </div>
    </footer>
  );
}
