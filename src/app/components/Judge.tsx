import React, { useState, useEffect } from "react";
import styles from "./Judge.module.css";

interface JudgeProps {
  isVoting: boolean | null;
  className?: string;
}

const Judge: React.FC<JudgeProps> = ({ isVoting, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousVotingState, setPreviousVotingState] = useState<
    boolean | null
  >(null);

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
    <>
      {/* non-animated background to prevent flicker */}
      <div
        className={`${styles.gavel} ${
          className || ""
        } absolute top-0 max-w-none`}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className={`${isAnimating ? styles.gavelAnimation : styles.gavel} ${
          className || ""
        } absolute top-0 max-w-none`}
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </>
  );
};

export default Judge;
