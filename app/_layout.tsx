import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from "./"; // Ensure the correct path to the Index component
import { TaskProvider } from '@/components/TaskContext';
import CompletedTasks from './CompletedTasks';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <TaskProvider>
      <Drawer.Navigator
        initialRouteName="Tasks"
        
        screenOptions={{

          drawerStyle: {
            backgroundColor: '#fff', // Drawer'ın arka plan rengi
            width: 250, // Drawer genişliği
            paddingTop: 20,
            borderColor: '#676667',
            borderWidth: 2,
          },
          drawerActiveTintColor: '#525252 ', // Seçili öğe yazı rengi
          drawerInactiveTintColor: '#676667', // Seçili olmayan öğe yazı rengi
          drawerActiveBackgroundColor: '#C0C0C0', // Seçili öğe arka plan rengi
          drawerInactiveBackgroundColor: '#fff', // Seçili olmayan öğe arka plan rengi
          
          drawerLabelStyle: {
            fontSize: 18, // Yazı boyutu
          },

          headerStyle: { backgroundColor: '#676667',height: 60  }, // Change the top navigator's color
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold'  ,fontSize: 24, },

          
        }}
      >
        <Drawer.Screen 
          name="All Tasks" 
          component={Index} 
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),

            
          }} 
        />
        <Drawer.Screen name="Completed Tasks" component={CompletedTasks} />
        {/* Add more screens here */}
      </Drawer.Navigator>
    </TaskProvider>
  );
}
