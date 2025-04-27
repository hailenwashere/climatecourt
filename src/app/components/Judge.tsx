import React, { useState, useEffect } from "react";
import styles from "./Judge.module.css";

interface JudgeProps {
    isVoting: boolean | null;
    children: React.ReactNode;
    className?: string;
}

const Judge: React.FC<JudgeProps> = ({ isVoting, children, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousVotingState, setPreviousVotingState] = useState<boolean | null>(null);
  
  // Trigger animation when !isVoting
  useEffect(() => {
    const triggerGavelAnimation = () => {
      if (isAnimating) return;

      setIsAnimating(true);

      // Reset animation after it completes (3 hits × 1.0s = 3.0s)
      setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
    };

    // Only trigger animation when isVoting changes from true to false
    if (previousVotingState === true && isVoting === false) {
      triggerGavelAnimation();
    }
    setPreviousVotingState(isVoting);
  }, [isVoting, previousVotingState, isAnimating]);
  
  

  return (
    <div 
      className={`${styles.judgeContainer} ${isAnimating ? styles.gavelAnimation : styles.gavel} ${className || ''}`}
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
};

export default Judge;