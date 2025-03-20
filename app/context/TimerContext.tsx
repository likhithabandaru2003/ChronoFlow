import React, { createContext, useContext, useState, useEffect } from "react";
import { Timer } from "../(tabs)/types";

interface TimerContextType {
  timers: Timer[];
  history: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<Timer[]>([]);

  // Move completed timers to history
  useEffect(() => {
    const completedTimers = timers.filter((timer) => timer.status === "Completed");
    if (completedTimers.length > 0) {
      setHistory((prevHistory) => [...prevHistory, ...completedTimers]);
      setTimers((current) => current.filter((timer) => timer.status !== "Completed"));
    }
  }, [timers]);

  const addTimer = (timer: Timer) => {
    setTimers((prev) => [...prev, timer]);
  };

  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers((prev) =>
      prev.map((timer) => (timer.id === id ? { ...timer, ...updates } : timer))
    );
  };

  return (
    <TimerContext.Provider value={{ timers, history, addTimer, updateTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};