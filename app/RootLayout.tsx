import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import Index from "./"; // Ensure the correct path to the Index component
import { useTaskContext } from '@/components/TaskContext';
import CompletedTasks from './CompletedTasks';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import AddTaskListModal from '@/components/AddTaskListModal';
import { TouchableOpacity, Text, View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const { taskLists } = useTaskContext();
  const [isAddTaskListModalVisible, setAddTaskListModalVisible] = useState(false); //"Add new list" modalını açıp kapatma

  return (

    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <TouchableOpacity onPress={() => navigation.navigate('All Tasks')}  style={[{  }, styles.drawerItem]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="home" size={24} color="black" style={{ marginRight: 10 }} />
          <Text style={[{fontWeight: 'bold'},styles.drawerItemText]}>All Tasks</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Completed Tasks')} style={styles.drawerItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="check-circle" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={[{fontWeight: 'bold'},styles.drawerItemText]}>Completed Tasks</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAddTaskListModalVisible(true)} style={styles.drawerItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="format-list-bulleted-add" size={20} color="black" style={{ marginRight: 10 }} />
          <Text style={[{fontWeight: 'bold'},styles.drawerItemText]}>Add New List</Text>
        </View>
      </TouchableOpacity>

      {taskLists.map(list => (        
        <TouchableOpacity
          key={list.id}
          onPress={() => navigation.navigate(list.name, { listId: list.id })}
          style={styles.drawerItem}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="format-list-bulleted" size={20} color="black" style={{ marginRight: 10 }} />
            <Text style={styles.drawerItemText}>{list.name}</Text>
          </View>
        </TouchableOpacity>        
      ))}
      </ScrollView>
      <AddTaskListModal
        visible={isAddTaskListModalVisible}
        onClose={() => setAddTaskListModalVisible(false)}
      />

    </View>

  );
  // AddTaskListModal'ı sona yazmak, 
  // modali kontrol etme ve görsel düzenin sorunsuz işlemesi için yaygın bir yöntemdir.
  // UI performansı ve görsellik açısından, modallar genellikle diğer öğelere 
  // müdahale etmeden görünmelidir, bu da sıralamanın önemini artırır.
}


export default function RootLayout() {
  const { taskLists } = useTaskContext();

  return (
    <Drawer.Navigator
      initialRouteName="All Tasks"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff', // Drawer'ın arka plan rengi
          width: 300, // Drawer genişliği
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

        headerStyle: { backgroundColor: '#676667', height: 60 }, // Change the top navigator's color
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
      }}
    >
      <Drawer.Screen
        name="All Tasks"
        component={Index}
        initialParams={{ listId: 0 }}
      />
      <Drawer.Screen
        name="Completed Tasks"
        component={CompletedTasks}
      />
      {taskLists.map(list => (
        <Drawer.Screen
          key={list.id}
          name={list.name}
          component={Index}
          initialParams={{ listId: list.id }}
        />
      ))}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 18,
  },
});