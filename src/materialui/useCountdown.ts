import { useEffect, useRef, useState } from 'react';

const secondsToTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const min = date.getMinutes();
  const minString = `${min < 10 ? '0' : ''}${min}`;
  const sec = date.getSeconds();
  const secString = `${sec < 10 ? '0' : ''}${sec}`;
  return `${minString}:${secString}`;
};

const useCountdown = (
  seconds = 30,
  initDisabled = false,
) => {
  const x = useRef(initDisabled ? seconds : 0);
  const [timeLeft, setTimeLeft] = useState(initDisabled ? seconds : 0);
  const progress = (timeLeft * 100) / seconds;
  const disabled = timeLeft > 0;
  const disable = () => { x.current = seconds; };
  const enable = () => { x.current = 0; setTimeLeft(0); };
  useEffect(() => {
    const interval = setInterval(() => {
      if (x.current > 0) {
        x.current -= 0.25;
        setTimeLeft(x.current);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return {
    disabled,
    timeLeft: secondsToTime(timeLeft),
    progress: 100 - progress,
    disable,
    enable,
  };
};

export default useCountdown;
