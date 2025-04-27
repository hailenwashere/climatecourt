/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { increment, onValue, ref, get, update } from "firebase/database";
import { db } from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage";
import UserAvatar from "@/app/components/UserAvatar";
import usePrevious from "@/app/usePrevious";

interface CourtroomLogic {
  secondsLeft: number;
  numPpl: number;
  currCrime: string;
  yayCount: number;
  nayCount: number;
}
export default function Courtroom() {
  const [vote, setVote] = useState<"yay" | "nay" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [courtroom, setCourtroom] = useState<CourtroomLogic>();
  // const [seconds, setSeconds] = useState();
  const [crime, setCrime] = useState<string>();
  // const [numPpl, setNumPpl] = useState(1);

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;
    setVote(newVote);
  };

  useEffect(() => {
    const courtroomLogicRef = ref(db, "logic");

    const changeVote = onValue(courtroomLogicRef, async (snapshot) => {
      const newCourtroom = snapshot.val();
      setCourtroom(newCourtroom);

      if (newCourtroom?.currCrime !== undefined) {
        const crimeRef = ref(db, `crimes/${newCourtroom.currCrime}`);
        const crimeSnapshot = await get(crimeRef);
        setCrime(crimeSnapshot.val().crime);
      }
    });

    return () => changeVote();
  }, []);

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

  return (
    <div className="flex flex-col justify-center items-center h-full min-h-screen gap-16 font-[family-name:var(--font-serif)]">
      {/* Card for Crime */}
      <div className="bg-[url('/judge.webp')] bg-cover bg-center w-[600px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg relative">
        <img
          src="/monitor.png"
          alt="Monitor"
          width="670px"
          className="max-w-none absolute left-1/2 -top-4 transform -translate-x-1/2 pointer-events-none"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-bold font-underline text-center w-[600px] bg-red-500 text-white rounded-lg p-2 font-sans whitespace-nowrap">
            Is This Moral in our Current Climate Catastrophe?
          </div>
          <div className="italic max-w-[600px] max-h-[150px] break-words text-center">
            {crime ? crime : "Loading..."}
          </div>
        </div>
        <div className="flex flex-row justify-between items-center mb-25 w-4/5">
          <div className="flex flex-col items-center">
            {courtroom ? `${courtroom.yayCount} Yays` : "Loading..."}
            <button
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
            <button
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
