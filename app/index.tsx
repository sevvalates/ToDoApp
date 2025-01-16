import { KeyboardAvoidingView,TextInput, Platform, StyleSheet , Text, View, TouchableOpacity, Keyboard } from "react-native";
import React, { useState } from 'react';
import Task from "@/components/Task";

export default function Index() {

  //const [task, setTask] = useState<string | null>(null);
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] =  useState<string[]>([]);


  const handleAddTask = () => {
    console.log("taskk");
    Keyboard.dismiss(); //yazdıktan sonra keyboard kendi kapansın diye
    setTaskItems([...taskItems,task]);
    setTask('');
  }

  const completeTask = (index: number) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);  // Removes the task at the given index
    setTaskItems(itemsCopy);
  }

  return (
    <View style={styles.container}>
      {/* Today s Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle} > Today's Tasks </Text>
        <View style={styles.items}>

          {
            taskItems.map((item, index) => {
              return(
                <TouchableOpacity key={index} onPress={()=>completeTask(index)}>
                  <Task text={item} />
                </TouchableOpacity>
              );
            })
          }
  
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a Task'} value={task} onChangeText={(text) => setTask(text)}/>
        <TouchableOpacity onPress={()=>handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}> + </Text>
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
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,    
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
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {

  },
});