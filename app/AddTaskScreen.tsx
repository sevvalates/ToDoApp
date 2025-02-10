import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskContext } from '@/components/TaskContext';
import { useNavigation } from '@react-navigation/native';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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

    const newTask = { id: Date.now(), text: taskText, completed: false, date: selectedDate };

    const updatedTaskLists = taskLists.map(list => {
      if (list.id === selectedListId) {
        return { ...list, tasks: [...list.tasks, newTask] };
      }
      return list;
    });

    await saveTaskLists(updatedTaskLists);
    navigation.goBack();
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
        <Text>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
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
