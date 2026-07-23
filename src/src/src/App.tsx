import React, { useEffect, useRef, useState } from 'react';

// Asset URLs
const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85';
const FRONT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4';
const OVERLAY_IMAGE =
  'https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png';

const NAV_ITEMS = ['Device', 'Real Stories', 'Science', 'Plans', 'Reach Us'];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string>('');

  // Refs for animation & positioning
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const smoothPos = useRef({ x: -1000, y: -1000 });
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

  // Body overflow lock on mobile menu toggle
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle Mouse Move over Hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Canvas Spotlight Radial Mask & Grid Parallax Loop
  useEffect(() => {
    let animFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions matching hero size
    const updateCanvasSize = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const ctx = canvas.getContext('2d');

    const render = () => {
      // Smooth cursor lerp (factor 0.1)
      smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * 0.1;
      smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * 0.1;

      // Update Parallax Shift for Layer 1 Grid
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const targetOffsetX = ((smoothPos.current.x - centerX) / rect.width) * 16;
        const targetOffsetY = ((smoothPos.current.y - centerY) / rect.height) * 16;

        setGridOffset((prev) => ({
          x: prev.x + (targetOffsetX - prev.x) * 0.06,
          y: prev.y + (targetOffsetY - prev.y) * 0.06,
        }));
      }

      // Draw Radial Gradient Mask on Offscreen Canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const radius = 260;
        const gradient = ctx.createRadialGradient(
          smoothPos.current.x,
          smoothPos.current.y,
          0,
          smoothPos.current.x,
          smoothPos.current.y,
          radius
        );

        // Mask gradient stops: 0-40% white, 60% 0.75, 75% 0.4, 88% 0.12, 100% 0
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
        gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(smoothPos.current.x, smoothPos.current.y, radius, 0, Math.PI * 2);
        ctx.fill();

        setMaskDataUrl(canvas.toDataURL());
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white select-none">
      {/* Hidden Offscreen Canvas for dynamic mask generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ------------------------------------------------------------- */}
      {/* NAVIGATION (z-50) */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-6 inset-x-0 z-50 px-6 md:px-12 pointer-events-none flex items-center justify-between">
        {/* Top Left Logo */}
        <div className="pointer-events-auto flex items-center">
          <a
            href="#"
            className="p-2 rounded-xl transition-opacity hover:opacity-80 focus:outline-none"
            aria-label="Measured Home"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 256 256"
              fill="white"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </a>
        </div>

        {/* Desktop Center Pill Nav */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-1 px-4 py-2 rounded-full liquid-glass shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className="px-4 py-1.5 text-sm font-medium text-white/70 hover:text-white rounded-full transition-colors duration-200"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Desktop Top Right CTA */}
        <div className="hidden md:block pointer-events-auto">
          <button className="liquid-glass flex items-center gap-2.5 px-5 py-2.5 rounded-full text-white text-sm font-medium hover:bg-white/5 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Reserve Yours</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden pointer-events-auto liquid-glass p-3 rounded-full flex flex-col justify-center items-center gap-1.5 w-11 h-11"
          aria-label="Open navigation menu"
        >
          <span className="w-5 h-[1.5px] bg-white rounded-full" />
          <span className="w-3.5 h-[1.5px] bg-white rounded-full self-start" />
        </button>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE FULLSCREEN MENU (z-55) */}
      {/* ------------------------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-[#0a0a0a] flex flex-col justify-between p-8 md:hidden text-white animate-fade-in">
          {/* Menu Top Bar with Close Button */}
          <div className="flex justify-between items-center">
            <svg width="28" height="28" viewBox="0 0 256 256" fill="white">
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center transition-transform duration-300 transform active:scale-90"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.18, 1)',
              }}
              aria-label="Close menu"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span className="absolute w-5 h-[1.5px] bg-white rotate-45" />
                <span className="absolute w-5 h-[1.5px] bg-white -rotate-45" />
              </div>
            </button>
          </div>

          {/* Staggered Vertical Menu Items */}
          <div className="flex flex-col items-center justify-center gap-6 my-auto">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item}
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl sm:text-4xl text-white/90 font-medium tracking-tight animate-menu-item"
                style={{
                  animationDelay: `${100 + index * 60}ms`,
                  opacity: 0,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Bottom Reserve CTA */}
          <div
            className="flex justify-center w-full animate-menu-item"
            style={{ animationDelay: `${100 + NAV_ITEMS.length * 60}ms`, opacity: 0 }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="liquid-glass w-full max-w-xs py-3.5 rounded-full text-white flex items-center justify-center gap-2.5 text-base font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>Reserve Yours</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION (100vh) */}
      {/* ------------------------------------------------------------- */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="font-helvetica-neue relative w-full h-screen overflow-hidden bg-black select-none"
      >
        {/* LAYER 1: SVG Grid Pattern with Parallax Shift (z-0) */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-10 transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${gridOffset.x}px, ${gridOffset.y}px, 0)`,
          }}
        >
          <svg className="w-full h-full" width="100%" height="100%">
            <defs>
              <pattern
                id="hero-grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* LAYER 2: Background Image (z-10) */}
        <div
          className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
        />

        {/* LAYER 3: Hero Title Header (z-20) */}
        <div className="absolute inset-x-0 top-20 sm:top-28 md:top-32 z-20 flex justify-center pointer-events-none">
          <h1 className="font-instrument uppercase text-white leading-[0.9] text-center tracking-tight text-[4.5rem] xs:text-[5.5rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem] drop-shadow-2xl">
            Measured
          </h1>
        </div>

        {/* LAYER 4: Atmosphere Overlay Image (z-25) */}
        <img
          src={OVERLAY_IMAGE}
          alt=""
          className="absolute inset-0 z-25 w-full h-full object-cover pointer-events-none mix-blend-screen opacity-90"
        />

        {/* LAYER 5: Spotlight Reveal Video (z-30) */}
        {/* clipped to bottom 60% of viewport with canvas radial reveal mask */}
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            clipPath: 'inset(40% 0 0 0)',
            WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
            maskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        >
          <video
            src={FRONT_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
