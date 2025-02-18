import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskContext } from '@/components/TaskContext';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';


export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { taskLists, saveTaskLists } = useTaskContext();
  const navigation = useNavigation();

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

    if (selectedListId === null) {
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

    //const newTask = { id: Date.now(), text: taskText, completed: false, date: selectedDate };
    const newTask = { 
      id: Date.now(), 
      text: taskText, 
      completed: false,
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

    const updatedTaskLists = taskLists.map(list => {
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
    <View style={styles.container}>
      <Text style={styles.label}>Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={taskText}
        onChangeText={setTaskText}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text>{selectedDate ? selectedDate.toLocaleString() : "Select Date & Time"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
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


      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  listItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedListItem: {
    backgroundColor: '#cce5ff',
  },
    addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
