import { Image, ScrollView, KeyboardAvoidingView, TextInput, Platform, StyleSheet, Text, View, TouchableOpacity, Keyboard, ToastAndroid, Alert } from "react-native";
import React, { useEffect, useState } from 'react';
import Task from "@/components/Task";
import { useTaskContext } from "@/components/TaskContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRoute, RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  Index: { listId?: number };
};

type IndexScreenRouteProp = RouteProp<RootStackParamList, 'Index'>;

export default function Index() {
  const route = useRoute<IndexScreenRouteProp>();

  type TaskItem = {
    id: number;
    text: string;
    completed: boolean;
  };
  
  const [taskItem, setTaskItem] = useState<TaskItem>({ id: Date.now(), text: '', completed: false });
  const { taskItems, saveTasks, addTask, deleteTask, saveTaskLists, taskLists } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);

  // Route'dan gelen listId'yi al
  const listId = route.params?.listId;

  // ListId'ye göre task'ları filtrele
  useEffect(() => {
    if (listId) {
      console.log("listId: ", listId);      
      const selectedList = taskLists.find(list => list.id === listId);
      if (selectedList) {
        setFilteredTasks(selectedList.tasks);
      }
    } else {
      // Eğer listId yoksa, tüm task'ları göster
      const allTasks = taskLists.flatMap(list => list.tasks);
      setFilteredTasks(allTasks);
    }
  }, [listId, taskLists]);
//}, [listId, taskLists.find(list => list.id === listId)]); //OLMADI- sadece ilgili liste takip ediliyor

  //TASK EKLEME 
  const handleAddTask = async () => {

      Keyboard.dismiss();

      if (taskItem.text === '') {
        if(Platform.OS === 'android'){
          ToastAndroid.showWithGravity(
            "Task cannot be empty",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
        else{
          Alert.alert("Warning","Task cannot be empty");
        }
        return;
      }

      const newTask = { ...taskItem, id: Date.now() };

      if(listId){ // Eğer bir liste seçiliyse, task'ı o listeye ekle                
      
        const updatedTaskLists = taskLists.map(list => {
          if (list.id === listId) {
            return { ...list, tasks: [...list.tasks, newTask] };
          }
          return list;
        });
        await saveTaskLists(updatedTaskLists);
        
      /*
       // Yukarıdaki kod yerine aşağıdaki kodu kullanabiliriz TÜM LİSTEYİ TEKERAR TEKRAR DOLAŞMAYA GEREK YOK
       //savetasklists yerine updatetasklist falan olabilir
        const updatedTaskLists = [...taskLists]; // Mevcut diziyi kopyala
        const listIndex = updatedTaskLists.findIndex(list => list.id === listId);
        
        if (listIndex !== -1) {
          updatedTaskLists[listIndex] = {
            ...updatedTaskLists[listIndex],
            tasks: [...updatedTaskLists[listIndex].tasks, newTask]
          };
        }
        await saveTaskLists(updatedTaskLists);*/
      }
      else {
        // Eğer liste seçili değilse, task'ı genel task listesine ekle
        await addTask(newTask);
      }

      setTaskItem({ id: Date.now(), text: '', completed: false });
  }

  //TASK TAMAMLAMA İŞARETLEME
  const toggleTaskCompletion = async (taskId: number) => {
      if (listId) {

        
        const updatedTaskLists = taskLists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: list.tasks.map(item =>
                item.id === taskId ? { ...item, completed: !item.completed } : item
              )
            };
          }
          return list;
        });
        await saveTaskLists(updatedTaskLists);
        /*
        // Yukarıdaki kod yerine aşağıdaki kodu kullanabiliriz 
        const updatedTaskLists = [...taskLists];
        const listIndex = updatedTaskLists.findIndex(list => list.id === listId);
        if (listIndex !== -1) {
          updatedTaskLists[listIndex] = {
            ...updatedTaskLists[listIndex],
            tasks: updatedTaskLists[listIndex].tasks.map(item =>
              item.id === taskId ? { ...item, completed: !item.completed } : item
            )
          };
        }
        await saveTaskLists(updatedTaskLists);
        */
      }
      else {
        const updatedTasks = taskItems.map(item =>
          item.id === taskId ? { ...item, completed: !item.completed } : item
        );
        await saveTasks(updatedTasks);
      }
  };

  //TASK SİLME
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
            if (listId) {
              const updatedTaskLists = taskLists.map(list => {
                if (list.id === listId) {
                  return { ...list, tasks: list.tasks.filter(task => task.id !== taskId) };
                }
                return list;
              });
              saveTaskLists(updatedTaskLists);
            } else {
              const updatedTasks = taskItems.filter(task => task.id !== taskId);
              saveTasks(updatedTasks);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <ScrollView style={styles.items}>
          {
            filteredTasks.length === 0 ? (
              <View style={styles.imageWrapper}>
                <Image source={require('@/assets/images/cat.png')} style={styles.image} />
                <Text style={styles.nothingText}> Nothing to do in </Text>
              </View>
            ) : (
              filteredTasks.map((item) => (
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
        <TextInput style={styles.input} placeholder={'Write a Task'} value={taskItem.text} onChangeText={(text) => setTaskItem({ id: taskItem.id, text, completed: false })} />
        <TouchableOpacity onPress={() => handleAddTask()}>
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