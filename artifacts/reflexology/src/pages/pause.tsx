import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Pause() {
  const [step, setStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  
  const STEPS = [
    "מוכנים? קחו רגע לעצמכם",
    "עצרו את התנועה",
    "שימו לב לכפות הרגליים על הקרקע",
    "הפנו תשומת לב לנשימה",
    "זהו אזור של מאמץ או כיווץ בגוף",
    "נסו לרכך את האזור הזה מעט",
    "קחו נשימה עמוקה נוספת",
    "תודה על העצירה. חזרו לגוף ולכאן."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Progress steps based on time
          if (newTime === 165) setStep(1); // 15s in
          if (newTime === 140) setStep(2); // 40s in
          if (newTime === 110) setStep(3); // 1m10s in
          if (newTime === 80) setStep(4);  // 1m40s in
          if (newTime === 50) setStep(5);  // 2m10s in
          if (newTime === 20) setStep(6);  // 2m40s in
          if (newTime === 0) {
            setStep(7); // done
            setIsActive(false);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && timeLeft === 0) {
      setTimeLeft(180);
      setStep(0);
    }
    setIsActive(!isActive);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-light text-primary tracking-tight">עצירה עכשיו</h1>
        <p className="text-muted-foreground text-lg">3 דקות של כיול מחדש למערכת העצבים</p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Breathing Animation Rings */}
        {isActive && (
          <>
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute inset-4 rounded-full bg-primary/30 blur-lg"
            />
          </>
        )}
        
        {/* Main Circle */}
        <div className="absolute inset-8 rounded-full border-2 border-primary/20 bg-card shadow-2xl flex flex-col items-center justify-center z-10 p-8 text-center gap-4">
          <div className="text-5xl font-light tabular-nums tracking-widest text-primary">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          
          <motion.div 
            key={step}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-16 flex items-center justify-center"
          >
            <p className="text-sm font-medium text-foreground text-balance">
              {STEPS[step]}
            </p>
          </motion.div>
        </div>
      </div>

      <Button 
        onClick={toggleTimer}
        size="lg" 
        className="w-48 rounded-full h-14 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        variant={isActive ? "secondary" : "default"}
      >
        {isActive ? "השהה" : timeLeft === 0 ? "התחל מחדש" : timeLeft < 180 ? "המשך" : "התחל עצירה"}
      </Button>
    </div>
  );
}
