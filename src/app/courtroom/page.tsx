/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { increment, onValue, ref, get, update } from "firebase/database";
import { db } from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage";
import UserAvatar from "@/app/components/UserAvatar";
import { useTimer } from 'react-timer-hook';
import usePrevious from "@/app/usePrevious";
import { motion } from "framer-motion";

interface CourtroomLogic {
  secondsLeft: number;
  numPpl: number;
  currCrime: string;
  yayCount: number;
  nayCount: number;
}
export default function Courtroom() {
  interface CourtroomLogic {
    secondsLeft: number,
    numPpl: number,
    currCrime: string
    yayCount: number,
    nayCount: number,
    endTime: number
  }

  const [vote, setVote] = useState<"yay" | "nay" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [courtroom, setCourtroom] = useState<CourtroomLogic>();
  const [crime, setCrime] = useState<String>();

  // for timer logic + judge animation trigger
  const [isVoting, setIsVoting] = useState<boolean | null>(null)
  const [timeNow, setTimeNow] = useState(Date.now());

  // timer hook needs an expiryTime to set to
  const expiryTimestamp = courtroom ? new Date(courtroom.endTime) : new Date();

  const {
    seconds,
    minutes,
    isRunning,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setIsVoting(false),
  });

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;
    setVote(newVote);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());  // forces re render every second --> ideally in a sep timer component so only the timer component is rerendered
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);  

  useEffect(() => {
    const courtroomLogicRef = ref(db, "logic");

    const changeVote = onValue(courtroomLogicRef, async (snapshot) => {
      const newCourtroom = snapshot.val();
      setCourtroom(newCourtroom);
      
      if (newCourtroom?.endTime > Date.now()) { // when a new prompt comes in, reset isVoting to true
        setIsVoting(true);
        const newExpiry = new Date(newCourtroom.endTime); // set a newExpiry timestamp for the timer
        restart(newExpiry, true); // true means autostrt the timer (so votes, which change the courtroom object) do not pause the timer countdown)
      } else {
        setIsVoting(false)
      }
  
      if (newCourtroom?.currCrime !== undefined) {
        const crimeRef = ref(db, `crimes/${newCourtroom.currCrime}`);
        const crimeSnapshot = await get(crimeRef);
        setCrime(crimeSnapshot.val().crime);
      }
    });

    return () => changeVote();
  }, []);

  useEffect(() => {
    if (courtroom?.endTime) { // when the courtroom timer changes, need to reset the timer
      const newExpiry = new Date(courtroom.endTime);
      restart(newExpiry, true); // restart the timer and auto start ticking
      setIsVoting(newExpiry.getTime() > Date.now());
    }
  }, [courtroom?.endTime]);

  useEffect(() => {
    // Update Firebase Realtime Database
    const updateVotes = async () => {
      if (!courtroom) {
        return;
      } else {
        const crimeRef = ref(db, `crimes/${courtroom.currCrime}`);
        const courtroomRef = ref(db, "logic");

        const decrement = hasVoted ? -1 : 0;
        const yesIncrement = vote === "yay" ? 1 : decrement;
        const noIncrement = vote === "yay" ? decrement : 1;

        setHasVoted(true);

        // updating realtime courtroom data
        await update(courtroomRef, {
          yayCount: increment(yesIncrement),
          nayCount: increment(noIncrement),
        });

        // updating crime (should be in firestore)
        const updatedCourtroomData = (await get(courtroomRef)).val();
        await update(crimeRef, {
          yayCount: updatedCourtroomData.yayCount,
          nayCount: updatedCourtroomData.nayCount,
        });
      }
    };
    updateVotes();
  }, [vote]);


  // // if we want a timer bar or countdown visual
  // function getTimeLeftPercent() {
  //   if (!courtroom?.endTime) return 0;
  
  //   const totalMillis = courtroom.endTime - Date.now();
  //   const fullDuration = courtroom.endTime - (Date.now() - (seconds + minutes*60 + hours*3600 + days*86400)*1000);
  
  //   return Math.max(0, (totalMillis / fullDuration) * 100);
  // }
  
  // isVoting affects both the timer (between displaying timeleft and "voting has ended") AND the buttons (disabled when not isVoting)

  return (
    <div className="flex flex-col justify-center items-center h-full min-h-screen gap-16 font-[family-name:var(--font-serif)]">
      <div>
        {isVoting ? (
          <div className="text-xl font-bold">
            <div>
              Voting ends in: {minutes}m {seconds}s
            </div>
          </div>
        ) : (
          <div className="text-xl font-bold text-red-500">
            Voting has ended.
          </div>
        )}
      </div>
      {/* Card for Crime */}
      <div style={{
          backgroundImage: `url('/judge.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="w-[600px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg relative">
        <img
          src="/monitor.png"
          alt="Monitor"
          width="670px"
          className="max-w-none absolute left-1/2 -top-4 transform -translate-x-1/2 pointer-events-none z-10"
        />
        <div className="flex flex-col items-center gap-4">
          <Marquee />
        <div className="max-w-[600px] max-h-[150px] text-center text-gray-800 text-2xl font-serif leading-relaxed border-b pb-2">
          {crime ? crime : "Loading..."}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mb-25 w-4/5">
          <div className="flex flex-col items-center">
            {courtroom ? `${courtroom.yayCount} Yays` : "Loading..."}
            <button disabled={!isVoting} 
              className={`btn text-xl ${
                vote === "yay" ? "btn-success" : "btn-outline"
              }`}
              onClick={() => handleVote("yay")}
            >
              Yay 👍
            </button>
          </div>
          <div className="flex flex-col items-center">
            {courtroom ? `${courtroom.nayCount} Nays` : "Loading..."}
            <button disabled={!isVoting} 
              className={`btn text-xl ${
                vote === "nay" ? "btn-error" : "btn-outline"
              }`}
              onClick={() => handleVote("nay")}
            >
              Nay 👎
            </button>
          </div>
        </div>
      </div>

      {/* Crowd */}
      <Crowd vote={vote} courtroom={courtroom} />

      {/* User Avatar */}
    </div>
  );
}

const Marquee = () => {
	const [textWidth, setTextWidth] = useState<number>(0);
	const text = `Is this moral in our current climate catastrophe? \xa0`;
	const repeatTimes = 8;
	const repeatedText = Array(repeatTimes).fill(text).join(" ");

	const textRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (textRef.current) {
			setTextWidth(textRef.current.offsetWidth);
		}
	}, [textRef]);

	const tickerVariants = {
		animate: {
			x: [0, -textWidth],
			transition: {
				x: {
					duration: 40,
					repeat: Infinity,
					repeatType: "loop",
					ease: "linear"
				}
			}
		}
	};

	return (
    <div className="overflow-hidden whitespace-nowrap w-[600px] bg-red-700 py-2 px-4 flex items-center shadow-xl">
      <motion.div
        className="inline-block text-[1.5rem] text-white font-bold tracking-wide font-sans uppercase"
        variants={tickerVariants}
        initial="animate"
        animate="animate"
        ref={textRef}
      >
        {repeatedText}
      </motion.div>
      <motion.div
        className="inline-block text-[1.5rem] text-white font-bold tracking-wide font-sans uppercase"
        variants={tickerVariants}
        initial="animate"
        animate="animate"
      >
        {repeatedText}
      </motion.div>
    </div>
  );
  
}

const Crowd = ({
  vote,
  courtroom,
}: {
  vote: "yay" | "nay" | null;
  courtroom: CourtroomLogic | undefined;
}) => {
  const [reactions, setReactions] = useState<("yay" | "nay" | "none")[]>([
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ]);

  const prevNayCount = usePrevious(courtroom?.nayCount);

  useEffect(() => {
    if (!courtroom?.nayCount) return;

    const updateReaction = (type: "yay" | "nay" | "none") => {
      const index = Math.floor(Math.random() * reactions.length);
      setReactions((prev) => {
        const newReactions = [...prev];
        newReactions[index] = type;
        return newReactions;
      });

      setTimeout(() => {
        setReactions((prev) => {
          const newReactions = [...prev];
          newReactions[index] = "none";
          return newReactions;
        });
      }, 3000);
    };

    if (courtroom.nayCount > (prevNayCount ?? courtroom.nayCount)) {
      updateReaction("nay");
    } else if (courtroom.nayCount < (prevNayCount ?? courtroom.nayCount)) {
      updateReaction("yay");
    }
  }, [courtroom?.nayCount, prevNayCount, reactions.length]);

  return (
    <div className="relative w-[600px] h-[300px] flex justify-center">
      <NPCImage
        key={0}
        type="A"
        x={100}
        y={100}
        opacity={0.5}
        chatDirection="left"
        displayChat={reactions[0]}
      />
      <NPCImage
        type="A"
        x={200}
        y={100}
        opacity={0.5}
        chatDirection="left"
        displayChat={reactions[1]}
      />
      <NPCImage
        type="A"
        x={300}
        y={100}
        opacity={0.5}
        chatDirection="right"
        displayChat={reactions[2]}
      />
      <NPCImage
        type="A"
        x={400}
        y={100}
        opacity={0.5}
        chatDirection="right"
        displayChat={reactions[3]}
      />

      <NPCImage
        type="A"
        x={50}
        y={50}
        opacity={1}
        chatDirection="left"
        displayChat={reactions[4]}
      />
      <NPCImage
        type="A"
        x={150}
        y={50}
        opacity={1}
        chatDirection="left"
        displayChat={reactions[5]}
      />
      <NPCImage
        type="A"
        x={250}
        y={50}
        opacity={1}
        chatDirection="right"
        displayChat={reactions[6]}
      />
      <NPCImage
        type="A"
        x={350}
        y={50}
        opacity={1}
        chatDirection="right"
        displayChat={reactions[7]}
      />
      <UserAvatar x={450} y={50} vote={vote} />
    </div>
  );
};
