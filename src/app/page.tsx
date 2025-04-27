"use client";
import { db } from "@/app/lib/firebase";
import { ref, set } from "firebase/database";
import React, { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center h-screen p-8 font-[family-name:var(--font-serif)]"
      style={{
        backgroundImage: "url('/paper-background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center w-2xl max-w-2/3 gap-[32px] h-full">
        <CourtTitle />
        <PlaintiffVsDefendant />
        <ConfessionBox />
      </div>
    </div>
  );
}
const CourtTitle = () => {
  return (
    <div className="flex flex-col gap-[8px] text-8xl italic font-extrabold w-full">
      <div className="bg-yellow-400 px-4">CLIMATE</div>
      <div className="bg-yellow-400 px-4">COURT</div>
    </div>
  );
};

const PlaintiffVsDefendant = () => {
  return (
    <div className="flex justify-center items-center w-full gap-8 text-2xl">
      <div className="text-right">
        THE CLIMATE CONSCIOUS, <br />
        Plaintiff
      </div>
      <div className="font-bold">vs.</div>
      <div className="text-right">
        YOU, <br />
        Defendant
      </div>
    </div>
  );
};

const ConfessionBox = () => {
  const [confession, setConfession] = useState<string>("");

  const crimeId = uuidv4();
  const crimeData = {
    id: crimeId,
    crime: confession,
    yayCount: 0,
    nayCount: 0,
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confession) return;
    alert(
      "Your climate crime has been recorded. The court will now deliberate."
    );
    // Push the crime data to Firebase
    set(ref(db, `crimes/${crimeId}`), crimeData);
    setConfession("");
  };

  return (
    <div className="w-full max-w-2xl mt-8 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="confess your climate crime..."
          className="w-full h-48 p-4 min-h-[100px] border border-gray-300 rounded-lg bg-white text-xl font-serif resize-none"
          required
        />
        <div className="flex flex-row justify-end w-full mt-2 ">
          <button
            type="submit"
            disabled={!confession}
            className="text-red-600 disabled:text-gray-300 disabled:cursor-default italic font-semibold hover:cursor-pointer inline-block relative before:content-[''] hover:before:content-['>'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:-translate-x-full pl-1.5"
          >
            submit to judgement
          </button>
        </div>
      </form>
    </div>
  );
};
