/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { increment, onValue, ref, get, update } from "firebase/database";
import { db } from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage";
import UserAvatar from "@/app/components/UserAvatar";
import { useTimer } from "react-timer-hook";
import Judge from "@/app/components/Judge";
import usePrevious from "@/app/usePrevious";
import { motion } from "framer-motion";
import Clock from "@/app/courtroom/clock";
import Verdict from "@/app/courtroom/verdict";

interface CourtroomLogic {
  secondsLeft: number;
  numPpl: number;
  currCrime: string;
  yayCount: number;
  nayCount: number;
}
export default function Courtroom() {
  interface CourtroomLogic {
    secondsLeft: number;
    numPpl: number;
    currCrime: string;
    yayCount: number;
    nayCount: number;
    endTime: number;
  }

  const [vote, setVote] = useState<"yay" | "nay" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [courtroom, setCourtroom] = useState<CourtroomLogic>();
  const [crime, setCrime] = useState<string>();
  const [judgement, setJudgment] = useState<string>("");
  const [innocentVerdict, setInnocentVerdict] = useState<string>("");
  const [guiltyVerdict, setGuiltyVerdict] = useState<string>("");

  // for timer logic + judge animation trigger
  const [isVoting, setIsVoting] = useState<boolean>(true);
  const [, setTimeNow] = useState(Date.now());

  // timer hook needs an expiryTime to set to
  const expiryTimestamp = courtroom ? new Date(courtroom.endTime) : new Date();

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => setIsVoting(false),
  });

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;
    setVote(newVote);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now()); // forces re render every second --> ideally in a sep timer component so only the timer component is rerendered
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const courtroomLogicRef = ref(db, "logic");

    const changeVote = onValue(courtroomLogicRef, async (snapshot) => {
      const newCourtroom = snapshot.val();
      setCourtroom(newCourtroom);

      if (newCourtroom?.endTime > Date.now()) {
        // when a new prompt comes in, reset isVoting to true
        setIsVoting(true);
        const newExpiry = new Date(newCourtroom.endTime); // set a newExpiry timestamp for the timer
        restart(newExpiry, true); // true means autostrt the timer (so votes, which change the courtroom object) do not pause the timer countdown)
      } else {
        setIsVoting(false);
      }

      if (newCourtroom?.currCrime !== undefined) {
        const crimeRef = ref(db, `crimes/${newCourtroom.currCrime}`);
        const crimeSnapshot = await get(crimeRef);
        setCrime(crimeSnapshot.val().crime);
        setJudgment(crimeSnapshot.val().judgeResponse);
        setInnocentVerdict(crimeSnapshot.val().innocentVerdict ?? "");
        setGuiltyVerdict(crimeSnapshot.val().guiltyVerdict ?? "");
      }
    });

    return () => changeVote();
  }, [restart]);

  useEffect(() => {
    if (courtroom?.endTime) {
      // when the courtroom timer changes, need to reset the timer
      const newExpiry = new Date(courtroom.endTime);
      restart(newExpiry, true); // restart the timer and auto start ticking
      setIsVoting(newExpiry.getTime() > Date.now());
    }
  }, [courtroom?.endTime, restart]);

  useEffect(() => {
    // reset hasVoted when the courtroom changes
    if (courtroom?.currCrime) {
      setHasVoted(false);
    }
  }, [courtroom?.currCrime]);

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

  const verdict =
    (courtroom?.yayCount ?? 0) > (courtroom?.nayCount ?? 0)
      ? innocentVerdict
      : guiltyVerdict;

  return (
    <div className="flex flex-col justify-center items-center h-full min-h-screen gap-16 font-[family-name:var(--font-serif)] pt-24">
      {/* Card for Crime */}
      <div className="w-[600px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg relative">
        <Verdict
          title={"Judgement"}
          text={isVoting ? "" : judgement}
          side="left"
          display={!isVoting}
        />
        <Verdict
          title={"Verdict"}
          text={isVoting ? "" : verdict}
          side="right"
          display={!isVoting}
        />
        <Clock seconds={seconds} minutes={minutes} />
        <img
          src="/monitor.png"
          alt="Monitor"
          width="670px"
          className="max-w-none absolute left-1/2 -top-4 transform -translate-x-1/2 pointer-events-none z-20"
        />

        <div className="flex flex-col items-center gap-4 z-10">
          <Marquee />
          <div className="max-w-[600px] max-h-[150px] text-center text-gray-800 text-2xl font-serif leading-relaxed border-b pb-2">
            {crime ? crime : "Loading..."}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mb-25 w-4/5 mt-15 z-10 font-sans">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-8 overflow-hidden flex items-center justify-center font-bold text-4xl text-green-600">
              {courtroom ? courtroom.yayCount : "-"}
            </div>
            <button
              disabled={!isVoting || vote === "yay"}
              className="btn text-xl bg-yellow-400"
              onClick={() => handleVote("yay")}
            >
              Yay
            </button>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-8 overflow-hidden flex items-center justify-center font-bold text-4xl text-red-600">
              {courtroom ? courtroom.nayCount : "-"}
            </div>
            <button
              disabled={!isVoting || vote === "nay"}
              className="btn text-xl bg-yellow-400"
              onClick={() => handleVote("nay")}
            >
              Nay
            </button>
          </div>
        </div>
        <Judge
          isVoting={isVoting}
          className="w-full max-w-[700px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg"
        />
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
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="overflow-hidden whitespace-nowrap w-[600px] bg-red-400 py-1 px-4 flex items-center shadow-xl">
      <motion.div
        className="inline-block text-[1.5rem] text-white font-bold tracking-wide uppercase"
        variants={tickerVariants}
        initial="animate"
        animate="animate"
        ref={textRef}
      >
        {repeatedText}
      </motion.div>
      <motion.div
        className="inline-block text-[1.5rem] text-white font-bold tracking-wide uppercase"
        variants={tickerVariants}
        initial="animate"
        animate="animate"
      >
        {repeatedText}
      </motion.div>
    </div>
  );
};

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
  const prevYayCount = usePrevious(courtroom?.yayCount);

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
    }
    if (courtroom.yayCount > (prevYayCount ?? courtroom.yayCount)) {
      updateReaction("yay");
    }
  }, [
    courtroom?.nayCount,
    courtroom?.yayCount,
    prevYayCount,
    prevNayCount,
    reactions.length,
  ]);

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
