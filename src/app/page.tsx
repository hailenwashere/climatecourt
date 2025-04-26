'use client'
import React, { useState, FormEvent } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col justify-between min-h-screen p-8 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col items-center gap-[32px]">
        <CourtHeading />
        <ConfessionBox />
        
        <div className="flex justify-between w-full max-w-2xl">
          <BreakingNewsButton />
          <JuryDutyButton />
        </div>
      </main>
      
      <footer className="text-center pb-4">
        made at LA Hacks 2025 by Helen Feng, Andrew Wang, Grace Yan, and Jason
        Zhang
      </footer>
    </div>
  );
}

const CourtHeading = () => {
  return (
    <div className="flex flex-row gap-[128px] items-center">
      <div className="text-lg text-right">
        THE CLIMATE CONSCIOUS, <br />
        Plaintiff,
        <div className="text-left">vs.</div>
        YOU,
        <br />
        Defendant
      </div>
      <div className="text-9xl italic bg-yellow-400 font-extrabold">
        CLIMATE COURT
      </div>
    </div>
  );
};

const ConfessionBox = () => {
  const [confession, setConfession] = useState<string>("");
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Your climate crime has been recorded. The court will now deliberate.");
    setConfession("");
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          placeholder="confess your climate crime.."
          className="w-full p-4 min-h-[100px] border border-gray-300 rounded-md bg-white text-lg font-serif"
          required
        />
        <button 
          type="submit" 
          className="btn btn-warning mt-4 px-8 py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-500"
        >
          Submit to Judgment
        </button>
      </form>
    </div>
  );
};

const BreakingNewsButton = () => {
  return (
    <button className="btn btn-outline border-2 border-gray-500 mbrounded-md px-8 py-3 w-[300px]">
      Breaking News
    </button>
  );
}

const JuryDutyButton = () => {
  return (
    <button className="btn btn-outline border-2 border-gray-500 rounded-md px-8 py-3 w-[300px]">
      Jury Duty
    </button>
  );
}