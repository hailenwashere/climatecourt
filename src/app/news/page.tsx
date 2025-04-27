"use client";

import React, { useEffect, useState } from "react";
import { EB_Garamond } from "next/font/google";
import { db } from "@/app/lib/firebase";
import { ref, get } from "firebase/database";

const garamond = EB_Garamond({ subsets: ["latin"] });

type Crime = {
  id: string;
  crime: string;
  yayCount: number;
  nayCount: number;
};

export default function BreakingNews() {
  const [crimes, setCrimes] = useState<Crime[]>([]);

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
    <div className="min-h-screen py-10 px-4 flex flex-col items-center bg-base-200">
      <header className="mb-6">
        <h1 className="text-4xl font-bold font-serif mb-1 ">
          climate court // BREAKING NEWS
        </h1>
        <p className="text-sm italic">independent, objective public shaming</p>
      </header>

      <div className="grid grid-flow-row-dense gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {crimes.length === 0 && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton h-44 w-96"></div>
            ))}
          </>
        )}
        {crimes.map((crime) => (
          <div
            key={crime.id}
            className="card w-96 bg-base-100 card-md card-border border-2 col-span1"
          >
            <div className="card-body justify-between">
              <h2
                className={`${garamond.className} card-title font-extrabold flex-auto"`}
              >
                {crime.crime}
              </h2>
              <div>
                <div className="divider" />
                <Result yesVotes={crime.yayCount} noVotes={crime.nayCount} />
              </div>
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
          className="bg-green-500 tooltip tooltip-left font-bold tooltip-neutral flex-auto"
          data-tip={`${yesVotes} yes votes`}
        />

        <div
          className="bg-red-500 tooltip tooltip-right font-bold tooltip-neutral transition-all duration-1000"
          data-tip={`${noVotes} no votes`}
          style={{ width: `${noWidth}%` }}
        />
      </div>
      <p className="text-sm font-bold">{totalVotes} total votes</p>
    </div>
  );
};
