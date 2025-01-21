import React, { createContext, useContext, useState } from 'react'; 

type TaskItem = {
  id: number;
  text: string;
  completed: boolean;
};

type TaskContextType = {
  taskItems: TaskItem[];
  setTaskItems: React.Dispatch<React.SetStateAction<TaskItem[]>>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

/*
interface TaskProviderProps {
  children: ReactNode;
}
//yada
export const TaskProvider = ({ children }: { children: ReactNode }) => {..}
*/

export const TaskProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  return (
    <TaskContext.Provider value={{ taskItems, setTaskItems }}>
      {children}
    </TaskContext.Provider>
  );
};
