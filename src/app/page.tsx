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
    judgeResponse: "",
    guiltyVerdict: "",
    innocentVerdict: ""
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confession) return;
    setLoading(true);
    // Call the model to get a response
    const result = await checkConfessionWithModel(confession);
    console.log(result);
    
    if (result.trim().toLowerCase() === "yes") {
      console.log("positive");
      const judgement = await generateJudgeResponse(confession);
      crimeData.judgeResponse = judgement;
      const guilty = await generateGuiltyVerdict(confession);
      crimeData.guiltyVerdict = guilty;
      const innocent = await generateInnocentVerdict(confession);
      crimeData.innocentVerdict = innocent;
      set(ref(db, `crimes/${crimeId}`), crimeData);
      setResponse("Your climate crime has been recorded. The court will now deliberate.");
    } else {
      setResponse("Your confession is not a valid climate crime.");
    }
    setLoading(false);
    (document.getElementById('pop-up') as HTMLDialogElement)?.showModal();
    setConfession("");
  };

  const checkConfessionWithModel = async (confession: string) => {
    const prompt = `Your sole job is to determine if the confession is related to climate change or the environment in some substantial way. The defendant is asking a panel of viewers to vote on their confession.

    The confession is: "${confession}". 

    Please respond with a single word answer: "yes" or "no".

    - "yes" means the confession is related to climate change or the environment in some way, either positively or negatively.
    - "no" means the confession is not related to climate change or the environment.

    Here are some examples of **good** confessions (climate-related):

    - "I wash my jeans after a single use" -> "yes" (related to water usage, environmental impact)
    - "I eat steak and eggs for breakfast" -> "yes" (related to meat consumption and its environmental impact)
    - "I shower three times a day" -> "yes" (related to water usage, environmental impact)
    - "I drive an electric car" -> "yes" (positive impact on the environment)
    - "I compost" -> "yes" (positive impact on the environment)

    Here are some **bad** examples (not related to climate change or the environment):

    - "I hate La hacks" -> "no" (not related to climate change or the environment)
    - "No" -> "no" (not a confession, and not related to the environment)
    - "I eat a lot of candy" -> "no" (not related to climate change)
    - "I don't like the color green" -> "no" (not related to climate change or the environment)
    - "I sold my laptop" -> "no" (not related to climate change or the environment)
    - "I painted my nails" -> "no" (not related to climate change or the environment)

    Once again, the confession must be related to climate change or the environment in some way. It can be good or bad, but it must have some connection to environmental issues. Otherwise you will respond with no. Please respond with a single word answer: "yes" or "no"`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  };  

  const generateJudgeResponse = async (confession: string) => {
    const prompt = `You are a climate-conscious judge with a sense of humor. The defendant is confessing that they do/think the following: "${confession}\". \
    Generate up to 4 sentences, judging how this confession might affect the environment with concrete and understandable facts, with quantitative impacts. If this is a good action for the environment \
    speak with a positive, humorous attitude about how this positively impacts the environment. If it is a wasteful or harmful belief/habit/action to the environment,
    share some knowledge on why this negatively impacts the environment, in a sarcastic and funny way. Limit the judgement to one topic. For example, if the crime were taking 30 minute showers, \
    don't talk about both water waste and carbon emissions, just talk about the more relevant topic.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const geminiResponse = response.text();
    console.log(geminiResponse);
    return geminiResponse;
  }

  const generateGuiltyVerdict = async (confession: string) => {
    const prompt = `The jury has decided that the defendant is guilty of harming the environment with their confession. Follow the following format \
    \"You've been found guilty of excessive water usage. \
    The court sentences you to a month of shorter showers! \
    Next time, remember that water conservation matters. \" \
    Be sure to add some humor but remind the defendant of what environtal impact their actions have. Limit the response to 3 sentences, like the format provided.
    `
    const result = await model.generateContent(prompt);
    const response = result.response;
    const geminiResponse = response.text();
    console.log(geminiResponse);
    return geminiResponse;
  }

  const generateInnocentVerdict = async (confession: string) => {
    const prompt = `The jury has decided that the defendant is innocent of harming the environment with their confession. Follow the following format \
    \"You've been found guilty of excessive water usage. \
    The court sentences you to a month of shorter showers! \
    Next time, remember that water conservation matters. \" \
    Except instead of being guily, the defendant is innocent and is not excessively harming the environment. \
    Be sure to add some humor but remind the defendant of what environtal impact their actions have. Limit the response to 3 sentences, like the format provided.
    `
    const result = await model.generateContent(prompt);
    const response = result.response;
    const geminiResponse = response.text();
    console.log(geminiResponse);
    return geminiResponse;
  }

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
            <div className="ml-5 flex flex-row items-center gap-2">
              <span>Processing...</span>
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
