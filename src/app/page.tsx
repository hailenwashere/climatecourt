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
    <div className="w-full max-w-2xl mt-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="confess your climate crime..."
          className="w-full h-48 p-4 min-h-[100px] border rounded-sm bg-white text-xl font-serif resize-none"
          required
        />
        <div className="flex flex-row justify-end w-full mt-2">
          <button
            type="submit"
            disabled={!confession}
            className="bg-yellow-400 clip-path-polygon italic py-2 pl-5 pr-6 disabled:text-gray-500 disabled:cursor-default disabled:bg-gray-300 disabled:transition-none disabled:translate-x-0 hover:bg-yellow-500 hover:cursor-pointer font-semibold mt-2.5 hover:translate-x-1 transition-transform duration-200 ease-in-out text-md"
          >
            submit to judgement
          </button>
        </div>
      </form>
    </div>
  );
};
