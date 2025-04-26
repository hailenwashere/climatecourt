export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-serif)]">
      <main className="flex flex-col gap-[32px] items-center">
        <CourtHeading />
      </main>
      <footer className="row-start-2 ">
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
