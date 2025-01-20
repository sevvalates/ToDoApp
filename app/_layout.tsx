import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from "./"; // Ensure the correct path to the Index component

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  return (
    <Drawer.Navigator
      initialRouteName="Tasks"
      screenOptions={{
        headerStyle: { backgroundColor: '#676667',height: 60  }, // Change the top navigator's color
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold'  ,fontSize: 24, },
      }}
    >
      <Drawer.Screen name="Tasks" component={Index} />
      {/* Add more screens here */}
    </Drawer.Navigator>
  );
}
