import React from "react";
import { Typewriter } from "react-simple-typewriter";

interface TypewriterEffectProps {
  sentences: string[];
  loop?: boolean;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenSentences?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  sentences,
  loop = false,
  typeSpeed = 80,
  deleteSpeed = 9999999,
  delayBetweenSentences = 20,
}) => {
  return (
    <Typewriter
      words={sentences}
      loop={loop}
      cursor
      cursorStyle="|"
      typeSpeed={typeSpeed}
      deleteSpeed={deleteSpeed}
      delaySpeed={delayBetweenSentences}
    />
  );
};

/**
 * Splits a paragraph into sentences for use w TypewriterEffect
 * @param paragraph - The full text to split into sentences
 * @returns An array of sentences
 */
export function splitParagraphIntoSentences(paragraph: string): string[] {
  if (!paragraph) return [];

  // Match sentence endings followed by space or end of string
  return (
    paragraph.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || []
  );
}

export default TypewriterEffect;
