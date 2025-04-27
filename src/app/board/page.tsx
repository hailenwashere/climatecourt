"use client";

import React, { useEffect, useState } from "react";
import { Nanum_Pen_Script } from "next/font/google";
import { db } from "@/app/lib/firebase";
import { ref, get } from "firebase/database";

const nanum = Nanum_Pen_Script({
  subsets: ["latin"],
  weight: "400",
});

type Crime = {
  id: string;
  crime: string;
  yayCount: number;
  nayCount: number;
};

export default function CrimeBoard() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [sortBy, setSortBy] = useState<"morality" | "total">("morality");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedCrimes = [...crimes].sort((a, b) => {
    // define how to calculate the value based on sortBy
    const getValue = (crime: Crime) => {
      switch (sortBy) {
        case "morality":
          return (
            (crime.yayCount / (crime.yayCount + crime.nayCount)) * 100 || 0
          );
        default:
          return crime.yayCount + crime.nayCount; // assuming this is the default case
      }
    };

    const aValue = getValue(a);
    const bValue = getValue(b);

    // apply sort direction
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  useEffect(() => {
    const fetchCrimes = async () => {
      const crimesRef = ref(db, "crimes");
      const snapshot = await get(crimesRef);
      if (snapshot.exists()) {
        const crimesData = snapshot.val();
        const formattedCrimes: Crime[] = Object.keys(crimesData).map((key) => ({
          id: key,
          crime: crimesData[key].crime,
          yayCount: crimesData[key].yayCount,
          nayCount: crimesData[key].nayCount,
        }));
        setCrimes(formattedCrimes);
      } else {
        console.log("No data available");
      }
    };
    fetchCrimes();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center gap-8 ">
      <header>
        <h1 className="text-4xl font-bold font-serif mb-1 ">
          climate court // CRIME BOARD
        </h1>
        <p className="text-sm italic">independent, objective public shaming</p>
      </header>
      <div className="flex flex-col items-end mb-6">
        <div className="flex flex-row gap-4">
          <span className="font-semibold">sort by</span>
          <CustomButton
            text="morality"
            active={sortBy === "morality"}
            handleClick={() => setSortBy("morality")}
          />
          <CustomButton
            text="total votes"
            active={sortBy === "total"}
            handleClick={() => setSortBy("total")}
          />
        </div>
        <div className="flex flex-row gap-4">
          <CustomButton
            text="asc"
            active={sortOrder === "asc"}
            handleClick={() => setSortOrder("asc")}
          />
          <CustomButton
            text="desc"
            active={sortOrder === "desc"}
            handleClick={() => setSortOrder("desc")}
          />
        </div>
      </div>
      <div className="grid grid-flow-row-dense gap-8 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {crimes.length === 0 && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-44 w-96"></div>
            ))}
          </>
        )}
        {sortedCrimes.map((crime) => (
          <StickyNote key={crime.id} crime={crime} />
        ))}
      </div>
    </div>
  );
}

const votePlural = (count: number) => {
  if (count === 1) {
    return "vote";
  }
  return "votes";
};

type ResultProps = {
  yesVotes: number;
  noVotes: number;
};

const Result = ({ yesVotes, noVotes }: ResultProps) => {
  const totalVotes = yesVotes + noVotes;
  const noPercentage = (noVotes / totalVotes) * 100;

  const [noWidth, setNoWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNoWidth(noPercentage);
    }, 50);
    return () => clearTimeout(timeout);
  }, [noPercentage]);

  return (
    <div className="flex flex-col gap-1 flex-en">
      <p className="text-sm italic">
        morally acceptable in the climate crisis?
      </p>
      <div className="flex flex-row w-full h-8">
        <div
          className="bg-green-500 tooltip  font-bold tooltip-neutral flex-auto "
          data-tip={`${yesVotes} yes ${votePlural(yesVotes)}`}
        />

        <div
          className="bg-red-500 tooltip  font-bold tooltip-neutral transition-all duration-1000"
          data-tip={`${noVotes} no ${votePlural(noVotes)}`}
          style={{ width: `${noWidth}%` }}
        />
      </div>
      <p className="text-sm font-bold">
        {totalVotes} total {votePlural(totalVotes)}
      </p>
    </div>
  );
};

const StickyNote = ({ crime }: { crime: Crime }) => {
  const rotations = [
    "rotate-1",
    "rotate-2",
    "-rotate-1",
    "-rotate-2",
    "rotate-0",
  ];
  const randomClass = rotations[Math.floor(Math.random() * rotations.length)];
  return (
    <div
      className={`${randomClass} card w-96 bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1 `}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)",
      }}
    >
      {/* Pin effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 shadow-md"></div>

      <div className="card-body justify-between p-6 pt-8">
        <h2
          className={`${nanum.className} card-title font-extrabold flex-auto text-gray-800 text-4xl py-4`}
        >
          {crime.crime}
        </h2>
        <div>
          <Result yesVotes={crime.yayCount} noVotes={crime.nayCount} />
        </div>
      </div>
    </div>
  );
};

const CustomButton = ({
  text,
  active,
  handleClick,
}: {
  text: string;
  active: boolean;
  handleClick: () => void;
}) => {
  return (
    <span>
      <button
        className={`${
          active
            ? "underline font-bold text-secondary"
            : "font-bold text-gray-900 opacity-70"
        }
        hover:cursor-pointer`}
        onClick={handleClick}
      >
        {text}
      </button>
    </span>
  );
};
