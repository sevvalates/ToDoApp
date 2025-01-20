import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from "./"; // Ensure the correct path to the Index component
import React, { useState } from 'react';
import CompletedTasks from './CompletedTasks';

const Drawer = createDrawerNavigator();

type TaskItem = {
  text: string;
  completed: boolean;
};

export default function RootLayout() {

  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);

  return (
    <Drawer.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        headerStyle: { backgroundColor: '#676667',height: 60  }, // Change the top navigator's color
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold'  ,fontSize: 24, },
      }}
    >
      <Drawer.Screen name="Tasks">
                {props => <Index {...props} taskItems={taskItems} setTaskItems={setTaskItems} />}
      </Drawer.Screen>

      <Drawer.Screen name="Completed Tasks">
                {props => <CompletedTasks {...props} tasks={taskItems.filter(task => task.completed)} />}
      </Drawer.Screen>
      {/* Add more screens here */}
    </Drawer.Navigator>
  );
}
