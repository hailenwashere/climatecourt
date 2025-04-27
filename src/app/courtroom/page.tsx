"use client";

import { use, useEffect, useState } from "react";
import { DatabaseReference, getDatabase, increment, onValue, ref, set, get, update } from "firebase/database"; 
import {db} from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage";
import UserAvatar from "@/app/components/UserAvatar";
import { useTimer } from 'react-timer-hook';
import Judge from "@/app/components/Judge";

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

  const [isVoting, setIsVoting] = useState<boolean | null>(null)
  const [timeNow, setTimeNow] = useState(Date.now());

  const expiryTimestamp = courtroom ? new Date(courtroom.endTime) : new Date();

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setIsVoting(false),
  });
  // const [numPpl, setNumPpl] = useState(1);

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;
    setVote(newVote);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());  // ← force React to re-render every second
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);  

  useEffect(() => {
    const courtroomLogicRef = ref(db, "logic");
  
    const changeVote = onValue(courtroomLogicRef, async (snapshot) => {
      const newCourtroom = snapshot.val();
      setCourtroom(newCourtroom);
      
      if (newCourtroom?.endTime > Date.now()) {
        setIsVoting(true);
        const newExpiry = new Date(newCourtroom.endTime);
        restart(newExpiry, true); 
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
    if (courtroom?.endTime) {
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
      }
      else {
        const crimeRef = ref(db, `crimes/${courtroom.currCrime}`);
        const courtroomRef = ref(db, "logic");
        let yesIncrement = 0;
        let noIncrement = 0;
        vote === "yay" ? yesIncrement = 1 : noIncrement = 1;
        if (hasVoted) {
          const courtroom = (await get(courtroomRef)).val();
          yesIncrement = vote === "yay" ? 1 : (courtroom.yayCount > 0 ? -1 : 0);
          noIncrement  = vote === "nay" ? 1 : (courtroom.nayCount > 0 ? -1 : 0);
        }
        setHasVoted(true);
        
        // updating realtime courtroom data
        await update(courtroomRef, {yayCount: increment(yesIncrement), nayCount: increment(noIncrement)});
        
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

  function getTimeLeftPercent() {
    if (!courtroom?.endTime) return 0;
  
    const totalMillis = courtroom.endTime - Date.now();
    const fullDuration = courtroom.endTime - (Date.now() - (seconds + minutes*60 + hours*3600 + days*86400)*1000);
  
    return Math.max(0, (totalMillis / fullDuration) * 100);
  }
  

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col items-center gap-8">
        {isVoting !== null && (
          <div className="flex flex-col items-center gap-2 w-full">
            {isVoting ? (
              <>
                <div className="text-xl font-bold">
                  Voting ends in: {days}d {hours}h {minutes}m {seconds}s
                </div>

                {/*Animated Progress Bar
                <div className="w-full max-w-[600px] bg-gray-300 h-4 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-green-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${getTimeLeftPercent()}%` }}
                  />
                </div> */}
              </>
            ) : (
              <div className="text-xl font-bold text-red-500">
                Voting has ended.
              </div>
            )}
          </div>
        )}

        {/* Card for Crime */}
        <Judge
          isVoting={isVoting}
          className="w-full max-w-[700px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="text-3xl font-bold font-underline text-center">
              Today&apos;s Court Case:
            </div>
            <div className="italic max-w-[600px] max-h-[150px] break-words text-center">
              {crime ? crime : "Loading..."}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-25 w-4/5">
            <div className="flex flex-col items-center">
              {courtroom ? `${courtroom.yayCount} Yays` : "Loading..."}
              <button
                disabled={!isVoting}
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
                disabled={!isVoting}
                className={`btn text-xl ${
                  vote === "nay" ? "btn-error" : "btn-outline"
                }`}
                onClick={() => handleVote("nay")}
              >
                Nay 👎
              </button>
            </div>
          </div>
        </Judge>

        {/* Crowd */}
        <div className="relative w-[600px] h-[300px] flex justify-center">
          <NPCImage type="A" x={100} y={100} opacity={0.5} />
          <NPCImage type="A" x={200} y={100} opacity={0.5} />
          <NPCImage type="A" x={300} y={100} opacity={0.5} />
          <NPCImage type="A" x={400} y={100} opacity={0.5} />

          <NPCImage type="A" x={50} y={50} opacity={1} />
          <NPCImage type="A" x={150} y={50} opacity={1} />
          <NPCImage type="A" x={250} y={50} opacity={1} />
          <NPCImage type="A" x={350} y={50} opacity={1} />
          <UserAvatar x={450} y={50} vote={vote} />
        </div>
      </main>

      <footer className="row-start-2 text-sm">
        made at LA Hacks 2025 by Helen Feng, Andrew Wang, Grace Yan, and Jason
        Zhang
      </footer>
    </div>
  );
}