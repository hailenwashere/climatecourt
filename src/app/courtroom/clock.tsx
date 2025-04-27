interface ClockProps {
  minutes: number;
  seconds: number;
}

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

const Clock = ({ minutes, seconds }: ClockProps) => {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -top-22 text-4xl px-4 pb-4 pt-2 right-0 m-4 z-20 w-fit border-3 rounded-md font-semibold font-mono"
      style={{ backgroundColor: "rgba(253, 243, 187, 1)" }}
    >
      {`${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`}
    </div>
  );
};

export default Clock;
