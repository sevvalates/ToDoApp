import React, { createContext, useContext, useEffect, useState } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

type TaskItem = {
  id: number;
  text: string;
  completed: boolean;
  date?: Date | null ;
  time?: Date | null ;
};

type TaskList = {
  id: number;
  name: string;
  tasks: TaskItem[];
};

type TaskContextType = {
  taskItems: TaskItem[];
  //setTaskItems: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  saveTasks: (newTasks: TaskItem[]) => Promise<void>;
  addTask: (newTask: TaskItem) => void;
  deleteTask: (taskId: number) => void;

  taskLists: TaskList[];
  addTaskList: (newTaskList: TaskList) => void;
  saveTaskLists: (newTaskLists: TaskList[]) => Promise<void>;
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
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  // Verileri AsyncStorage'dan yükle
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const storedTaskLists = await AsyncStorage.getItem('taskLists');

        if (storedTasks) {
          setTaskItems(JSON.parse(storedTasks));
        }
        if (storedTaskLists) {

          const parsedTaskLists = JSON.parse(storedTaskLists).map((list:TaskList) => ({
            ...list,
            tasks: list.tasks.map((task :TaskItem) => ({
              ...task,
              date: task.date ? new Date(task.date) : null,
              time: task.time ? new Date(task.time) : null,
            })),
          }));


          setTaskLists(parsedTaskLists);
        } else {
          const defaultList = { id: 1, name: 'Default List', tasks: [] };
          setTaskLists([defaultList]);
          await saveTaskLists([defaultList]);
        }
      } catch (error) {
        console.log("Veriler yüklenemedi: ", error);
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

  const saveTaskLists = async (newTaskLists: TaskList[]) => {
    try {

      const serializedTaskLists = newTaskLists.map(list => ({
        ...list,
        tasks: list.tasks.map(task => ({
          ...task,
          date: task.date ? task.date.toISOString() : null,
          time: task.time ? task.time.toISOString() : null,
        })),
      }));

      await AsyncStorage.setItem('taskLists', JSON.stringify(serializedTaskLists));
      setTaskLists(newTaskLists);
    } catch (error) {
      console.log("Veriler kaydedilemedi: ", error);
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

  const addTaskList = (newTaskList: TaskList) => {
    const updatedTaskLists = [...taskLists, newTaskList];
    saveTaskLists(updatedTaskLists);
  };

  //{children}, TaskProvider içine eklenen tüm bileşenleri temsil eder.
  return (
    <TaskContext.Provider value={{ taskItems, taskLists, saveTasks,saveTaskLists, addTask, deleteTask, addTaskList }}>
      {children} 
    </TaskContext.Provider>
  );
};


