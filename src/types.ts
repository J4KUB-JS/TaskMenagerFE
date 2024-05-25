export interface Task {
  id: number;
  name: string;
  desc: string;
  dueDate: string;
  done: boolean;
  isNew?: boolean;
}
