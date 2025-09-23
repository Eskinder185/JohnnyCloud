import { motion, useReducedMotion } from "framer-motion";
import TypewriterText from "./TypewriterText";

interface HeroIntroProps {
  username?: string;
  className?: string;
}

export default function HeroIntro({ username: _username = "Explorer", className = "" }: HeroIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section 
      aria-label="JohnnyCloud greeting" 
      className={`relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-10 md:px-10 md:py-14 shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Animated backdrop with gradient orbs and pulsing rings */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? {} : {
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? {} : {
            x: [0, -15, 0],
            y: [0, 10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        {/* Pulsing rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 border border-cyan-400/10 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 border border-purple-400/10 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Greeting pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/80 mb-6"
      >
        <motion.span
          animate={shouldReduceMotion ? {} : { rotate: [0, 14, -8, 14, -4, 10, 0] }}
          transition={shouldReduceMotion ? {} : {
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          👋
        </motion.span>
        <span className="font-bold text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Welcome to Johnny Cloud</span>
      </motion.div>

      {/* Headline with gradient and sheen effect */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-balance mb-4"
      >
        <motion.span
          className="bg-gradient-to-r from-sky-300 via-indigo-200 to-fuchsia-300 bg-clip-text text-transparent relative"
          animate={shouldReduceMotion ? {} : {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          Johnny-5 is ready to help you secure, optimize, and master your AWS cloud.
          {/* Sheen effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={shouldReduceMotion ? {} : {
              x: ["-100%", "100%"],
            }}
            transition={shouldReduceMotion ? {} : {
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        </motion.span>
      </motion.h1>

      {/* Subheadline with Typewriter Effect */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-3xl text-base md:text-lg xl:text-xl text-white/80 mb-8 leading-relaxed hero-sub"
      >
        <TypewriterText
          texts={[
            "Get real-time metrics, security guardrails, and cost insights—all in one place.",
            "Enforce security guardrails and spot compliance issues before they become problems.",
            "Spot cost anomalies fast and optimize your AWS spending automatically."
          ]}
          typingSpeed={40}
          deletingSpeed={25}
          pauseTime={3000}
          className="text-white/80"
        />
      </motion.div>

    </section>
  );
}
