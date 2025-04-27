"use client";

import { use, useEffect, useState } from "react";
import { DatabaseReference, getDatabase, increment, onValue, ref, set, get, update } from "firebase/database"; 
import {db} from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage";
import UserAvatar from "@/app/components/UserAvatar";

export default function Courtroom() {
  interface CourtroomLogic {
    secondsLeft: number,
    numPpl: number,
    currCrime: string
  }

  interface Crime {
    crime: string,
    yayCount: number,
    nayCount: number
  }

  const [vote, setVote] = useState<"yay" | "nay" | null>(null);
  const [courtroom, setCourtroom] = useState<CourtroomLogic>();
  // const [seconds, setSeconds] = useState();
  const [crime, setCrime] = useState<Crime>();
  // const [numPpl, setNumPpl] = useState(1);

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;
    setVote(newVote);
  };

  useEffect(() => {
    const courtroomLogicRef= ref(db, "logic");
    onValue(courtroomLogicRef, async (snapshot) => {
      setCourtroom(snapshot.val());
      const crimeId = snapshot.val().currCrime;
      const crimeRef = ref(db, `crimes/${crimeId}`);
      const crimeVal = (await get(crimeRef)).val();
      setCrime(crimeVal);
    });
  },[])

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
        if (vote) {
          const crime = (await get(crimeRef)).val();
          yesIncrement = vote === "yay" ? 1 : (crime.yayCount > 0 ? -1 : 0);
          noIncrement  = vote === "nay" ? 1 : (crime.nayCount > 0 ? -1 : 0);
        }
       
        await update(crimeRef, {yayCount: increment(yesIncrement), nayCount: increment(noIncrement)});
        await update(courtroomRef, {yayCount: increment(yesIncrement), nayCount: increment(noIncrement)});
      }
    };
    updateVotes();
  }, [vote]);

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col items-center gap-8">
        
        {/* Card for Crime */}
        <div className="bg-[url('/judge.webp')] bg-cover bg-center w-full max-w-[700px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="text-3xl font-bold font-underline text-center">Today's Court Case:</div>
            <div className="italic max-w-[600px] max-h-[150px] break-words text-center">
              {crime ? crime.crime : "Loading..."}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-25 w-4/5">
            <div className ="flex flex-col items-center"> 
              {crime ? `${crime.yayCount} Yays` : "Loading..."}
              <button className={`btn text-xl ${vote === "yay" ? "btn-success" : "btn-outline"}`} onClick={() => handleVote("yay")}>
                Yay 👍
              </button>
            </div>
            <div className ="flex flex-col items-center"> 
              {crime ? `${crime.nayCount} Nays` : "Loading..."}
              <button className={`btn text-xl ${vote === "nay" ? "btn-error" : "btn-outline"}`} onClick={() => handleVote("nay")}>
                Nay 👎
              </button>
            </div>
          </div>
        </div>

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
          <UserAvatar x={450} y={50} vote={vote}/>
        </div>

      </main>

      <footer className="row-start-2 text-sm">
        made at LA Hacks 2025 by Helen Feng, Andrew Wang, Grace Yan, and Jason Zhang
      </footer>
    </div>
  );
}