"use client";
import { model } from "@/app/lib/firebase"

export default function TestEnv() {

  const run = async () => {
    // Provide a prompt that contains text
    const crime = "I shower 3 times a day for 30 minutes each.";
    const prompt = `You are a snarky, sarcastic, and climate-conscious judge with a sense of humor. The defendant is pleading guilty for their \
      crime \"${crime}\". The jury votes on how much they relate to this crime and ${40} percent of them agree. Generate up to 5 sentences, \
      referencing how this crime might affect one part of the environment with concrete and understandable facts, with quantitative impacts.`;

    // To generate text output, call generateContent with the text input
    const result = await model.generateContent(prompt);
    // console.log('Tokens used:', result.tokensUsed); 

    const response = result.response;
    const text = response.text();
    console.log(text);
  }

   return (
    <div className="flex items-center justify-center h-screen p-8">
      <button onClick={() => run()} className="bg-blue-500 text-white p-4 rounded hover:cursor-pointer">
        Generate Text
      </button>
    </div>
  );
}