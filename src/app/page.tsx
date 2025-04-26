"use client";
import React, { useState, FormEvent } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="flex flex-col justify-between h-screen p-8 font-[family-name:var(--font-serif)]"
      style={{
        backgroundImage: "url('/paper-background.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="flex flex-col items-center gap-[32px] mb-auto">
        <CourtTitle />
        <PlaintiffVsDefendant />
        <ConfessionBox />

        <div className="flex justify-between w-full max-w-2xl">
          <BreakingNewsButton />
          <JuryDutyButton />
        </div>
      </div>
    </div>
  );
}
const CourtTitle = () => {
  return (
    <div className="flex flex-col gap-[8px] text-9xl italic font-extrabold text-center">
      <div className="bg-yellow-400 px-8">CLIMATE</div>
      <div className="bg-yellow-400 px-8">COURT</div>
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      "Your climate crime has been recorded. The court will now deliberate."
    );
    setConfession("");
  };

  return (
    <div className="w-full max-w-2xl mt-8 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="confess your climate crime.."
          className="w-full p-20 min-h-[100px] border border-gray-300 rounded-lg bg-white text-2xl font-serif resize-none"
          required
        />
        <button
          type="submit"
          className="btn btn-warning mt-4 mb-12 rounded-lg px-12 py-6 bg-yellow-400 text-black font-bold hover:bg-yellow-500"
        >
          submit to judgement
        </button>
      </form>
    </div>
  );
};

const BreakingNewsButton = () => {
  return (
    <Link href="/crimes">
      <button className="btn btn-outline border-2 border-gray-500 rounded-lg px-8 py-3 w-[300px]">
        breaking news
      </button>
    </Link>
  );
};

const JuryDutyButton = () => {
  return (
    <Link href="/courtroom">
      <button className="btn btn-outline border-2 border-gray-500 rounded-lg px-8 py-3 w-[300px]">
        jury duty
      </button>
    </Link>
  );
};
