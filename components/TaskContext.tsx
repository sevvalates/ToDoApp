import React, { createContext, useContext, useEffect, useState } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


type TaskItem = {
  id: number;
  text: string;
  completed: boolean;
};

type TaskContextType = {
  taskItems: TaskItem[];
  //setTaskItems: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  
  saveTasks: (newTasks: TaskItem[]) => Promise<void>;
  addTask: (newTask: TaskItem) => void;
  deleteTask: (taskId: number) => void;
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

  // Verileri AsyncStorage'dan yükle
  useEffect(() => {

    const loadTasks = async () => {
      try{
        const storedTasks = await AsyncStorage.getItem('tasks');
        if(storedTasks){
          setTaskItems(JSON.parse(storedTasks));
        }
      } 
      catch(error){
        console.log("Veriler yüklenemedi: ",error);
      }
    };

    loadTasks();

  }, []);

  // Verileri AsyncStorage'a kaydet
  const saveTasks = async (newTasks : TaskItem[]) => {
    try{
      await AsyncStorage.setItem('tasks',JSON.stringify(newTasks));
      setTaskItems(newTasks);
    }
    catch(error){
      console.log("Veriler kaydedilemedi: ",error);
    }
  };

  //sonradan ekledim addtask deletetask 24.01.2025
  const addTask = (newTask : TaskItem) => {
    const updatedTasks = [...taskItems, newTask];
    saveTasks(updatedTasks); // Tek bir merkezde veri saklama
  };
  
  const deleteTask = (taskId : number) => {
    const updatedTasks = taskItems.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks); // Aynı mantıkla çalışır
  };
  

  return (
    <TaskContext.Provider value={{ taskItems, saveTasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};


