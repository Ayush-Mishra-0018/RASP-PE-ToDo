export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress'
}

export interface Todo {
  id: string;
  user_id: string;
  task: string;
  status: TaskStatus;
  start_date: Date;
  end_date: Date;
}