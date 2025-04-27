"use client";

import { useEffect, useState } from "react";
import { DatabaseReference, getDatabase, increment, onValue, ref, set, get, update } from "firebase/database"; 
// import { Crowd } from "@/components/crowd.tsx"; // or wherever you put it
import {db} from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
import { snapshotEqual } from "firebase/firestore";
import NPCImage from "../components/npcimage";

export default function Courtroom() {
  interface CourtroomLogic {
    secondsLeft: number,
    numPpl: number,
    currCrime: number
  }

  // interface Crime {
  //   crimeID: number,
  //   yay: number,
  //   nay: number
  // }

  const [vote, setVote] = useState<"yay" | "nay" | null>(null);
  const [courtroom, setCourtroom] = useState<CourtroomLogic>();
  const [selfsprite, setSelfsprite] = useState();
  // const [seconds, setSeconds] = useState();
  // const [crime, setCrime] = useState();
  // const [numPpl, setNumPpl] = useState(1);

  const handleVote = async (newVote: "yay" | "nay") => {
    if (newVote === vote) return;

    // Update Firebase Realtime Database
    if (!courtroom) {
      return;
    }
    else {
      const crimeRef = ref(db, `crimes/${courtroom.currCrime}`);
      let yesIncrement = 0;
      let noIncrement = 0;
      newVote === "yay" ? yesIncrement = 1 : noIncrement = 1;
      if (vote) {
        const crime = (await get(crimeRef)).val();
        yesIncrement = newVote === "yay" ? 1 : (crime.yayCount > 0 ? -1 : 0);
        noIncrement  = newVote === "nay" ? 1 : (crime.nayCount > 0 ? -1 : 0);
      }
     
      await update(crimeRef, {yayCount: increment(yesIncrement), nayCount: increment(noIncrement)});


    }

    setVote(newVote);
  };

  useEffect(() => {
    const courtroomLogicRef= ref(db, "logic");
    onValue(courtroomLogicRef, (snapshot) => setCourtroom(snapshot.val()));
  },[])

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col gap-[32px] items-center">
        <div className="text-center flex flex-col gap-8 items-center">
          <div className="text-3xl font-bold">
            🌎 Crime:
          </div>
          <div className="text-2xl italic">
            "Driving 2 minutes to the bus station every day"
          </div>

          <div className="flex gap-8">
            <button
              className={`btn text-xl ${
                vote === "yay" ? "btn-success" : "btn-outline"
              }`}
              onClick={() => handleVote("yay")}
            >
              Yay 👍
            </button>
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
        <div>
          <NPCImage type="A" x={500} y={500} opacity={.5}/>
          <NPCImage type="A" x={400} y={500} opacity={.5}/>
          <NPCImage type="A" x={600} y={500} opacity={.5}/>
          <NPCImage type="A" x={700} y={500} opacity={.5}/>
        </div>
        <div>
          <NPCImage type="A" x={550} y={550} opacity={1}/>
          <NPCImage type="A" x={450} y={550} opacity={1}/>
          <NPCImage type="A" x={350} y={550} opacity={1}/>
          <NPCImage type="A" x={650} y={550} opacity={1}/>
          {/* <NPCImage type="A" x={750} y={550} opacity={1}/>  */}
        </div>
      </main>
      <footer className="row-start-2 text-sm">
        made at LA Hacks 2025 by Helen Feng, Andrew Wang, Grace Yan, and Jason Zhang
      </footer>
    </div>
  );
}