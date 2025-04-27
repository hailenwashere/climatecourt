import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";

interface CourtroomLogic {
    secondsLeft: number,
    numPpl: number,
    currCrime: string
    yayCount: number,
    nayCount: number,
    endTime: number
  }

interface TimerProps {
    courtroom : CourtroomLogic,
    isVoting : boolean | null,
    setIsVoting: (newState : boolean) => void
}
const Timer : React.FC<TimerProps> = ({courtroom, isVoting, setIsVoting}) => {
    const [timeNow, setTimeNow] = useState(Date.now());
    const expiryTimestamp = courtroom ? new Date(courtroom.endTime) : new Date();


    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        restart,
    } = useTimer({
        expiryTimestamp,
        onExpire: () => setIsVoting(false),
    });

    useEffect(() => {
        const interval = setInterval(() => {
          setTimeNow(Date.now());  // ← force React to re-render every second
        }, 1000);
      
        return () => clearInterval(interval);
    }, []);  

    return (
        {isVoting && (
            <div className="flex flex-col items-center gap-2 w-full">
              {isVoting ? (
                <>
                  <div className="text-xl font-bold">
                    Voting ends in: {days}d {hours}h {minutes}m {seconds}s
                  </div>
  
                  {/* Animated Progress Bar
                  <div className="w-full max-w-[600px] bg-gray-300 h-4 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-green-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${getTimeLeftPercent()}%` }}
                    />
                  </div> */}
                </>
              ) : (
                <div className="text-xl font-bold text-red-500">
                  Voting has ended.
                </div>
              )}
            </div>
        )}
    );
}
 
export default Timer;