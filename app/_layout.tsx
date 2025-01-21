import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from "./"; // Ensure the correct path to the Index component
import { TaskProvider } from '@/components/TaskContext';
import CompletedTasks from './CompletedTasks';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <TaskProvider>
      <Drawer.Navigator
        initialRouteName="Tasks"
        screenOptions={{
          headerStyle: { backgroundColor: '#676667',height: 60  }, // Change the top navigator's color
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold'  ,fontSize: 24, },
        }}
      >
        <Drawer.Screen name="Tasks" component={Index} />
        <Drawer.Screen name="Completed Tasks" component={CompletedTasks} />
        {/* Add more screens here */}
      </Drawer.Navigator>
    </TaskProvider>
  );
}
