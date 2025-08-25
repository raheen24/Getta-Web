// import { useEffect, useState } from "react";
// import { CircularProgress, Typography, Box } from "@mui/material";

// const CountdownTimer = ({ duration = 60 }) => {
//   const [timeLeft, setTimeLeft] = useState(duration);
//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     let interval;

//     if (timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => {
//           const updated = prev - 1;
//           setProgress((updated / duration) * 100);
//           return updated;
//         });
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [duration, timeLeft]);

//   return (
//     <Box sx={{ position: "relative", display: "inline-flex" }}>
//       <CircularProgress
//         className="otpTimer"
//         variant="determinate"
//         value={progress}
//         size={100}
//         thickness={3}
//         sx={{ color: "#002250" }}
//       />
//       <Box
//         sx={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//           position: "absolute",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography variant="h6" sx={{ color: "#002250", fontWeight: "bold" }}>
//           {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default CountdownTimer;
import { useEffect, useState, useRef } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

type CountdownTimerProps = {
  duration?: number;
  onFinish?: () => void;
  resetTrigger?: number;
};
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 60,
  onFinish,
  resetTrigger,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);
  const finishedRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const updated = prev - 1;
          setProgress((updated / duration) * 100);
          return updated;
        });
      }, 1000);
    }

    if (timeLeft === 0 && !finishedRef.current) {
      finishedRef.current = true;
      onFinish?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [duration, timeLeft, onFinish]);

  useEffect(() => {
    setTimeLeft(duration);
    setProgress(100);
    finishedRef.current = false;
  }, [resetTrigger, duration]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        className="otpTimer"
        variant="determinate"
        value={progress}
        size={100}
        thickness={3}
        sx={{ color: "#002250" }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#002250", fontWeight: "bold" }}>
          {`00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CountdownTimer;
