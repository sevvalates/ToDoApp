import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskContext } from '@/components/TaskContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TaskItem = {
  id: number;
  listId: number;
  text: string;
  completed: boolean;
  date?: Date | null;
  time?: Date | null;
};

type RootStackParamList = {
  'Add/Edit Task': { task?: TaskItem; listId?: number };
};

type AddTaskScreenRouteProp = RouteProp<RootStackParamList, 'Add/Edit Task'>;

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  //const [selectedDate, setSelectedDate] = useState(new Date());
  //const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  // Başlangıçta null
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);  // Başlangıçta null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isListVisible, setIsListVisible] = useState(false); // State to control dropdown visibility
  const { taskLists, saveTaskLists } = useTaskContext();
  const navigation = useNavigation();
  const route = useRoute<AddTaskScreenRouteProp>();
  const taskToEdit = route.params?.task;
  const initialListId = route.params?.listId ?? null;


  useEffect(() => {

    console.log("GİRDİ");

    if (taskToEdit) {
      setTaskText(taskToEdit.text);
      setSelectedDate(taskToEdit.date ? new Date(taskToEdit.date) : null);
      setSelectedTime(taskToEdit.time ? new Date(taskToEdit.time) : null);
      setSelectedListId(taskToEdit.listId || null);
    }
    else {
      setSelectedListId(initialListId);
    }
  }, [taskToEdit]);

  const handleAddTask = async () => {

    if (taskText.trim() === '') {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          "Task cannot be empty",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Warning", "Task cannot be empty");
      }
      return;
    }

    console.log("BBBBBBBBBBBBBBBBBBBBB",selectedListId);

    if (selectedListId === null || selectedListId === 0) {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          "Please select a list",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        Alert.alert("Warning", "Please select a list");
      }
      return;
    }


    const newTask = { 
      id: taskToEdit ? taskToEdit.id : Date.now(), 
      listId: selectedListId,
      text: taskText, 
      completed: taskToEdit ? taskToEdit.completed : false,
      date: selectedDate, 
      time: selectedTime 
    };


    console.log("TASK CNM",selectedDate);
    console.log("TASK CNM",selectedTime);


    // Bildirim tarihini hesapla
    if (selectedDate && selectedTime) {
      const notificationTime = new Date(selectedDate);
      notificationTime.setHours(selectedTime.getHours());
      notificationTime.setMinutes(selectedTime.getMinutes());
  
      // Bildirimi planla
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Reminder for task: ${taskText}`,
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationTime,
          channelId: 'reminders',
        }
      });
    }

    console.log("aa",selectedDate);
    console.log("aa",selectedTime);
/*
    const updatedTaskLists = taskLists.map(list => {
      if (list.id === selectedListId) { //bunun içiiii???
        const updatedTasks = taskToEdit
          ? list.tasks.map(task => task.id === taskToEdit.id ? newTask : task)
          : [...list.tasks, newTask];
        return { ...list, tasks: updatedTasks };

         //return { ...list, tasks: [...list.tasks, newTask] }; //bu vardı sadece
      }
      return list;
    });
  */
 

    /**
    * Eğer görev aynı listede kalıyorsa (yani selectedListId === taskToEdit.listId), önce eski versiyonunu siliyoruz.
    * sonra güncellenmiş halini ekliyoruz.
    * Böylece, aynı listede güncellenmiş versiyonu tekrar eklenmiş oluyor ve eski sürüm çakışma yaratmıyor.
    */

   // Eğer taskToEdit eski listeden sil
    let updatedTaskLists = taskLists.map(list => {
      if (taskToEdit && list.id === taskToEdit.listId) {
        return { ...list, tasks: list.tasks.filter(task => task.id !== taskToEdit.id) };
      }
      return list;
    });

    // editlenen Yeni hali ya da yeni taskı listeye ekle
    updatedTaskLists = updatedTaskLists.map(list => {
      if (list.id === selectedListId) {
        return { ...list, tasks: [...list.tasks, newTask] };
      }
      return list;
    });

    await saveTaskLists(updatedTaskLists);
    navigation.goBack();
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setShowTimePicker(true);
    }
  };

  /*
  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time && selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setSelectedDate(newDate);
    }
    console.log("bbb",selectedDate);
    console.log("bb",selectedTime);
  };
*/

const handleTimeChange = (event: any, time?: Date) => {
  setShowTimePicker(false);
  if (time  && selectedDate) {
    setSelectedTime(time); // selectedTime'i güncelle

    // selectedDate ve selectedTime'i birleştir
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    setSelectedDate(combinedDateTime); // Birleştirilmiş tarih-saat'i selectedDate'e ata
  }
  console.log("Selected Time:", time);
  console.log("Combined Date and Time:", selectedDate);
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <View style={styles.container}>
      <Text style={styles.label}>Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={taskText}
        onChangeText={setTaskText}
      />

      <Text style={styles.label}>Reminder: Date & Time </Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text>{selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}</Text>
          <MaterialIcons name="calendar-today" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {selectedDate && (
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
          <Text>{selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Time"}</Text>
          <MaterialIcons name="access-time" size={24} color="black" style={styles.icon} />

        </TouchableOpacity>
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <Text style={styles.label}>List</Text>

      <TouchableOpacity onPress={() => setIsListVisible(!isListVisible)} style={styles.listPicker}>
        <Text>{selectedListId ? taskLists.find(list => list.id === selectedListId)?.name : 'Select List'}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>

      {isListVisible && (
        <ScrollView style={{ maxHeight: 200 }}>
          {taskLists.map(list => (
            <TouchableOpacity
              key={list.id}
              onPress={() => {
                setSelectedListId(list.id);
                setIsListVisible(false); // Close the dropdown after selecting
              }}
              style={[
                styles.listItem,
                selectedListId === list.id && styles.selectedListItem
              ]}
            >
              <Text>{list.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Save Task</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8EAED',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,

    flexDirection: 'row', // Ensure date and icon are aligned horizontally
    justifyContent: 'space-between', // Align text and icon to opposite ends
    alignItems: 'center', // Vertically center the items
    backgroundColor: '#FFF',
  },
  listItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  selectedListItem: {
    backgroundColor: '#cce5ff',
  },
  addButton: { 
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#C0C0C0',
    padding: 15,
    borderRadius: 5,
    borderColor: '#C0C0C0',
    borderWidth: 3,
    alignItems: 'center' 
  },
  addButtonText: {
    color: '#676667',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10, // Adds space between text and icon
  },
  listPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'scroll',
  },
});

	
      /* List dropdown
      {taskLists.map(list => (
        <TouchableOpacity
          key={list.id}
          onPress={() => setSelectedListId(list.id)}
          style={[
            styles.listItem,
            selectedListId === list.id && styles.selectedListItem
          ]}
        >
          <Text>{list.name}</Text>
        </TouchableOpacity>
      ))}
      */