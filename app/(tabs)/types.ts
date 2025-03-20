export interface Timer {
  id: string;
  duration: number;
  remaining: number;
  category: string;
  status: TimerStatus;
  completedAt?:string
  name:string
}

export enum TimerStatus {
    Running = "Running",
    Paused = "Paused",
    Completed = "Completed",
  }