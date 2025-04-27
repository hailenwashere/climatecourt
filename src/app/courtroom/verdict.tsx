/* eslint-disable @next/next/no-img-element */

import { useTypewriter } from "@/app/components/useTypewriter";

const Verdict = ({
  title,
  text,
  side,
  display,
}: {
  title: string;
  text: string;
  side: "left" | "right";
  display: boolean;
}) => {
  const displayedText = useTypewriter(text, 12);
  const xClass = side === "left" ? "-translate-x-3/3" : "translate-x-3/3";
  console.log(display);
  // combine opacity and transform in a single transition
  const visibilityClass = display
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <div
      className={`absolute z-50 -top-20 ${xClass} ${visibilityClass} transition-all duration-600 ease-in-out`}
    >
      <div className="relative flex justify-center items-center my-8">
        <img
          src="/scroll.png"
          alt="Scroll background"
          width={420}
          className="object-contain"
        />
        <div className="absolute inset-0 flex flex-col justify-start items-center p-8 text-center mt-24">
          <h2 className="font-serif text-4xl font-bold mb-2 text-amber-950 italic">
            {title}
          </h2>
          <p className="leading-[18px] font-serif text-sm text-amber-950 w-[240px] text-start spacing-0">
            {displayedText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verdict;
