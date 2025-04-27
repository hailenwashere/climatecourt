"use client";
import { db } from "@/app/lib/firebase";
import { ref, set } from "firebase/database";
import React, { useState, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { model } from "@/app/lib/firebase";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen p-8 font-[family-name:var(--font-serif)]">
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
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const crimeId = uuidv4();
  const crimeData = {
    id: crimeId,
    crime: confession,
    yayCount: 0,
    nayCount: 0,
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confession) return;
    setLoading(true);
    // Call the model to get a response
    const result = await checkConfessionWithModel(confession);
    console.log(result);
    setLoading(false);

    if (result.trim().toLowerCase() === "yes") {
      console.log("positive");
      set(ref(db, `crimes/${crimeId}`), crimeData);
      setResponse("Your climate crime has been recorded. The court will now deliberate.");
    } else {
      setResponse("Your confession is not a valid climate crime.");
    }
    (document.getElementById('pop-up') as HTMLDialogElement)?.showModal();
    setConfession("");
  };

  const checkConfessionWithModel = async (confession: string) => {
    const prompt = `Your sole job is to determine if the confession is at least tangentially related to climate change. The defendant is asking a panel of viewers to vote on their confession. \n\nThe confession is: "${confession}".\n Please respond with a single word answer: "yes" or "no".\n This determines if the confession is related to the environment on some way.\n\n Here are some examples: \n\n "I leave the water on when brushing my teeth." -> "yes"\n\n "I eat meat." -> "yes"\n\n "I like to play video games." -> "no"\n\n "I shower 3 times a day for 30 minutes each." -> "yes"\n\n "I drive a car." -> "yes"\n\n "I use plastic straws." -> "yes"\n\n "I use reusable bags." -> "yes"\n\n Once again, the confession is simply something related to the environment; it can be good or bad. \n\n Please respond with a single word answer: "yes" or "no".`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
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
        <div className={`flex flex-row ${loading ? "justify-between" : "justify-end"} w-full mt-2`}>
          {loading && (
            <div className="ml-5">
              <span>Thinking...</span>
              <div className="spinner"></div>
            </div>
          )}
          <button
            type="submit"
            disabled={!confession || loading}
            className="bg-yellow-400 clip-path-polygon italic py-2 pl-5 pr-6 disabled:text-gray-500 disabled:cursor-default disabled:bg-gray-300 disabled:transition-none disabled:translate-x-0 hover:bg-yellow-500 hover:cursor-pointer font-semibold mt-2.5 hover:translate-x-1 transition-transform duration-200 ease-in-out text-md"
          >
            submit to judgement
          </button>
        </div>
      </form>
      <dialog id="pop-up" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <p className="py-4">{response}</p>
        </div>
      </dialog>
    </div>
  );
};
