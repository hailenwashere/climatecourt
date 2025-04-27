"use client";

import { useEffect, useState } from "react";
import { DatabaseReference, getDatabase, increment, onValue, ref, set, get, update } from "firebase/database"; 
import {db} from "@/app/lib/firebase"; // assuming you already set up firebase like your earlier message
// import Image from "next/image";
import NPCImage from "@/app/components/NpcImage.tsx";
import UserAvatar from "@/app/components/UserAvatar.tsx";

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
      <main className="flex flex-col items-center gap-8">
        
        {/* Card for Crime */}
        <div className="bg-[url('/judge.webp')] bg-cover bg-center w-full max-w-[700px] h-[400px] flex flex-col justify-between items-center p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="text-3xl font-bold font-underline text-center">Today's Court Case:</div>
            <div className="italic max-w-[600px] max-h-[150px] break-words text-center">
              "Driving 2 minutes to the bus station every day"
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-25 w-4/5">
            <button className={`btn text-xl ${vote === "yay" ? "btn-success" : "btn-outline"}`} onClick={() => handleVote("yay")}>
              Yay 👍
            </button>
            <button className={`btn text-xl ${vote === "nay" ? "btn-error" : "btn-outline"}`} onClick={() => handleVote("nay")}>
              Nay 👎
            </button>
          </div>
        </div>

        {/* Judge
        <div className="relative w-[300px] h-[300px]">
          <Image
            src="/judge.webp"
            alt="Judge Bob"
            fill
            className="object-contain"
          />
        </div> */}

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

      {/* <main className="flex flex-col gap-[32px] items-center"> */}
        {/* <div className="text-center flex flex-col gap-8 items-center">
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
        </div> */}

        {/* <div className="bg-[url('/judge.webp')] bg-cover bg-center w-full h-[500px]">
          <div className="text-center flex flex-col gap-5 items-center">
            <div className="pt-10 text-3xl font-bold">
              🌎 Crime:
            </div>
            <div className="text-2xl italic max-w-[600px] break-words text-center">
              "Driving 2 minutes to the bus station every day"
            </div>
          </div>
          <div className="flex gap-8 items-center mt-8">
            <button className={`btn text-xl ${vote === "yay" ? "btn-success" : "btn-outline"}`} onClick={() => handleVote("yay")}>
              Yay 👍
            </button>
            <button className={`btn text-xl ${vote === "nay" ? "btn-error" : "btn-outline"}`} onClick={() => handleVote("nay")}>
              Nay 👎
            </button>
          </div>
        </div>
        
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

      </main> */}
      <footer className="row-start-2 text-sm">
        made at LA Hacks 2025 by Helen Feng, Andrew Wang, Grace Yan, and Jason Zhang
      </footer>
    </div>
  );
}