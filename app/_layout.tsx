import { NavigationContainer } from '@react-navigation/native';
import { TaskProvider } from '@/components/TaskContext';
import RootLayout from './RootLayout';

export default function App() {
  return (
    <TaskProvider>
        <RootLayout />
    </TaskProvider>
  );
  // RootLayout, TaskProvider içindeki verileri ve fonksiyonları useTaskContext() ile kullanabilir.
}