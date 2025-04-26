import React from "react";
import { EB_Garamond } from "next/font/google";

const garamond = EB_Garamond({ subsets: ["latin"] });
// dummy crime data
const crimes = [
  {
    id: 1,
    title: "i shower twice a day",
    context:
      "can't wake up without a long hot shower. evening cleanse is non-negotiable.",
    votes: { yes: 104, no: 297 },
    controversy: 89,
    author: "Anonymous Gen Z, moderate, vegan-curious",
    tags: ["#waterwaste", "#selfcare"],
  },
  {
    id: 2,
    title: "i drive 3 minutes to the gym",
    context: "the walk is up a big hill and it ruins the vibes.",
    votes: { yes: 41, no: 269 },
    controversy: 72,
    author: "Anonymous Millennial, left, flexitarian",
    tags: ["#carbs", "#gymbro"],
  },
  {
    id: 3,
    title: "i buy new fast fashion every month",
    context: "it's literally a dopamine hit. thrift is cringe.",
    votes: { yes: 3, no: 402 },
    controversy: 97,
    author: "Anonymous Gen Alpha, apolitical, omnivore",
    tags: ["#fashion", "#dopaminefiend"],
  },
  {
    id: 4,
    title: "i buy new fast fashion every month",
    context: "it's literally a dopamine hit. thrift is cringe.",
    votes: { yes: 3, no: 402 },
    controversy: 97,
    author: "Anonymous Gen Alpha, apolitical, omnivore",
    tags: ["#fashion", "#dopaminefiend"],
  },
  {
    id: 5,
    title: "i buy new fast fashion every month",
    context: "it's literally a dopamine hit. thrift is cringe.",
    votes: { yes: 3, no: 402 },
    controversy: 97,
    author: "Anonymous Gen Alpha, apolitical, omnivore",
    tags: ["#fashion", "#dopaminefiend"],
  },
  {
    id: 6,
    title: "i buy new fast fashion every month",
    context: "it's literally a dopamine hit. thrift is cringe.",
    votes: { yes: 3, no: 402 },
    controversy: 97,
    author: "Anonymous Gen Alpha, apolitical, omnivore",
    tags: ["#fashion", "#dopaminefiend"],
  },
];

// dumb function to get label for controversy ranking

export default function BreakingNews() {
  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center bg-base-200">
      <header className="mb-6">
        <h1 className="text-4xl font-bold font-serif mb-1 ">
          climate court // BREAKING NEWS
        </h1>
        <p className="text-sm italic">independent, objective public shaming</p>
      </header>

      <div
        className={`${garamond.className} flex flex-row gap-4 flex-wrap max-w-7xl`}
      >
        {crimes.map((crime) => (
          <div
            key={crime.id}
            className="card w-96 bg-base-100 card-xl card-border border-2"
          >
            <div className="card-body">
              <h2 className="card-title font-extrabold">
                {crime.title.toUpperCase()}
              </h2>
              <p>{crime.context}</p>
              <div className="divider" />
              <Result yesVotes={crime.votes.yes} noVotes={crime.votes.no} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type ResultProps = {
  yesVotes: number;
  noVotes: number;
};

const Result = ({ yesVotes, noVotes }: ResultProps) => {
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = (yesVotes / totalVotes) * 100;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm italic">
        should this be morally acceptable in the climate crisis?
      </p>
      <div className="flex flex-row w-full h-8">
        <div
          className={`bg-green-500`}
          style={{ width: `${yesPercentage}%` }}
        />
        <div className="bg-red-500 flex-auto" />
      </div>
      <p className="text-sm font-bold">{totalVotes} total votes</p>
    </div>
  );
};
