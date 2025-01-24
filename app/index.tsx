import { Image,ScrollView, KeyboardAvoidingView,TextInput, Platform, StyleSheet , Text, View, TouchableOpacity, Keyboard, ToastAndroid, Alert } from "react-native";
import React, { useState } from 'react';
import Task from "@/components/Task";
import { useTaskContext } from "@/components/TaskContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Index() {

  //const [task, setTask] = useState('');
  //const [taskItems, setTaskItems] =  useState<string[]>([]);
  type TaskItem = {
    id: number;
    text: string;
    completed: boolean;
  };
  
  //const [taskItem, setTaskItem] = useState<TaskItem>({text: '', completed: false});
  //const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  
  const [taskItem, setTaskItem] = useState<TaskItem>({id: Date.now(), text: '', completed: false});
  //const { taskItems, setTaskItems } = useTaskContext();
 
 // const { taskItems, saveTasks } = useTaskContext();
  const { taskItems, saveTasks, addTask , deleteTask } = useTaskContext();

  const handleAddTask = async () => {
    console.log("taskk");
    Keyboard.dismiss(); //yazdıktan sonra keyboard kendi kapansın diye
    if(taskItem.text === ''){
      ToastAndroid.showWithGravity(
        "Task cannot be empty",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }

    //setTaskItems([...taskItems, taskItem]);
    //setTaskItem({text: '',completed: false});  //yeni bir görev ekledikten sonra giriş alanının temizlenmesini sağlar.
    
    //setTaskItems([...taskItems, { ...taskItem, id: Date.now() }]);
    //setTaskItem({id: Date.now(), text: '', completed: false});  

  /*
    const newTaskList = [...taskItems, {...taskItem,id: Date.now()}];
    await saveTasks(newTaskList);
    setTaskItem({id: Date.now(), text: '', completed: false});
  */
    const newTask = {...taskItem,id: Date.now()};
    addTask(newTask); 
    setTaskItem({id: Date.now(), text: '', completed: false});
  }
  /*
  //kullanmıyorum
  const completeTask = (index: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            let itemsCopy = [...taskItems];
            itemsCopy.splice(index, 1);  // Removes the task at the given index
            setTaskItems(itemsCopy);
          }
        }
      ],
      { cancelable: true }
    );
  }
*/

/*  
  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = taskItems.map((item, i) => 
        i === index ? { ...item, completed: !item.completed } : item
    );
    setTaskItems(updatedTasks);
  };
*/

  const toggleTaskCompletion = async (taskId: number) => {
    const updatedTasks = taskItems.map(item => 
        item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    //setTaskItems(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            deleteTask(taskId);
          }
        }
      ],
      { cancelable: true }
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <ScrollView style={styles.items}>
          {
            taskItems.length === 0 ? (
              <View style={styles.imageWrapper} >
                <Image source={require('@/assets/images/cat.png')} style={styles.image} />
                <Text style= {styles.nothingText}> Nothing to do </Text>
              </View>
            ) : (
              taskItems.map((item) => (
                <TouchableOpacity key={item.id} onLongPress={() => handleDeleteTask(item.id)}>
                  <Task 
                      key={item.id} 
                      text={item.text} 
                      completed={item.completed}
                      onToggleComplete={() => toggleTaskCompletion(item.id)} 
                  />
                </TouchableOpacity>
              ))
            )
          }
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a Task'} value={taskItem.text} onChangeText={(text) => setTaskItem({id: taskItem.id, text, completed: false})}/>
        <TouchableOpacity onPress={() => handleAddTask() }>
          <View style={styles.addWrapper}>
              <MaterialIcons 
                      name={'add'} 
                      size={50} 
                      color={'#676667'}
              />          
          </View> 
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 10,
    marginBottom: 155,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 40,    
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 3,
    width: 280,
    marginLeft: 15,
  },
  addWrapper: {
    width: 75,
    height: 75,
    backgroundColor: '#C0C0C0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 3,
    marginRight: 15,
  },
  addText: {

  },
  imageWrapper: {
    //backgroundColor: '#3399FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 100,
    marginTop: 50,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  nothingText: {
    marginTop: 5,
    fontSize: 20,
    color: '#666666',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});