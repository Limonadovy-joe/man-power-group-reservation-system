import React, { useEffect, useRef, useState } from "react";
import { now } from "fp-ts/Date";

type TimeRecord = { hour: number; minute: number; second: number };

type Unit = "sec" | "min" | "hou";

const getTimeRecord =
  (date: Date) =>
  (unit: Unit): TimeRecord => ({
    hour: date.getHours() * 60 * 60,
    minute: date.getMinutes() * 60,
    second: date.getSeconds(),
  });

export const useTime = () => {
  const [time, setTime] = useState(0);
  const intervalId = useRef<NodeJS.Timer | null>(null);

  const getTimeRecord =
    (date: Date) =>
    (unit: Unit): TimeRecord => ({
      hour: date.getHours() * 60 * 60,
      minute: date.getMinutes() * 60,
      second: date.getSeconds(),
    });

  React.useEffect(() => {
    intervalId.current = setInterval(() => {
      const { hour, minute, second } = getTimeRecord(new Date())("sec");
      const timeUpdated = hour + minute + second;
      setTime(timeUpdated);
    }, 1000);

    return () =>
      intervalId.current ? clearInterval(intervalId.current) : undefined;
  }, [time]);

  return [time] as const;
};
