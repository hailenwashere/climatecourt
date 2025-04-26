"use client";
import React, { useState, FormEvent } from "react";

export default function Home() {
  return (
    <div className="flex flex-col justify-between h-screen p-8 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col items-center gap-[32px] mb-auto">
        <CourtHeading />
        <ConfessionBox />

        <div className="flex justify-between w-full max-w-2xl">
          <BreakingNewsButton />
          <JuryDutyButton />
        </div>
      </main>
    </div>
  );
}

const CourtHeading = () => {
  return (
    <div className="flex flex-row gap-[128px] items-center">
      <div className="text-2xl text-right">
        THE CLIMATE CONSCIOUS, <br />
        Plaintiff,
        <div className="text-left">vs.</div>
        YOU,
        <br />
        Defendant
      </div>
      <div className="flex flex-col gap-[8px] text-9xl italic font-extrabold">
        <div className="bg-yellow-400 px-8">CLIMATE</div>
        <div className="bg-yellow-400 px-8">COURT</div>
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
    <div className="w-full max-w-2xl mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="confess your climate crime.."
          className="w-full p-4 min-h-[100px] border border-gray-300 rounded-md bg-white text-xl font-serif"
          required
        />
        <button
          type="submit"
          className="btn btn-warning mt-4 px-8 py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-500"
        >
          submit to judgement
        </button>
      </form>
    </div>
  );
};

const BreakingNewsButton = () => {
  return (
    <button className="btn btn-outline border-2 border-gray-500 mb-4 rounded-md px-8 py-3 w-[300px]">
      breaking news
    </button>
  );
};

const JuryDutyButton = () => {
  return (
    <button className="btn btn-outline border-2 border-gray-500 rounded-md px-8 py-3 w-[300px]">
      jury duty
    </button>
  );
};
