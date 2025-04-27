"use client";
import { model } from "@/app/lib/firebase"

export default function TestEnv() {

  const run = async () => {
    // Provide a prompt that contains text
    const prompt = "Write a story about a magic backpack. Limit it 10 sentences. Include a character named Timmy and a dragon named Sparky. The story should be set in a forest and include a treasure map.";

    // To generate text output, call generateContent with the text input
    const result = await model.generateContent(prompt);
    console.log('Tokens used:', result.tokensUsed); 

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