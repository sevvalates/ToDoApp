import React, { useState } from 'react';
import { Modal, Text,TextInput, Button, View, StyleSheet ,Platform,ToastAndroid} from 'react-native';
import { useTaskContext } from '@/components/TaskContext';

// Prop'ların tiplerini tanımla
interface AddTaskListModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddTaskListModal({ visible, onClose }:AddTaskListModalProps){

  const [listName, setListName] = useState('');
  const { addTaskList ,taskLists} = useTaskContext();

  const generateUniqueListName = (name: string): string => {
    let newName = name;
    let count = 1;

    while (taskLists.some(list => list.name === newName)) {
      newName = `${name} (${count})`;
      count++;
    }

    return newName;
  };

  const handleAddTaskList = () => {
    if (listName.trim() !== '' && listName.length < 20 ) { 
      const uniqueName = generateUniqueListName(listName.trim()); // Yeni isim oluştur
    
      const newTaskList = {
        id: Date.now(),
        name: uniqueName, // Doğrudan uniqueName kullan
        tasks: [],
      };
      
      addTaskList(newTaskList);
      setListName(''); // State'i sıfırla
      onClose();
    }
    else if (listName.length >= 20) {
      if(Platform.OS === 'android'){
        ToastAndroid.showWithGravity(
          "List name must be less than 20 characters",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
      else if(Platform.OS === 'ios'){
       alert('List name must be less than 20 characters');
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New List</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter list name"
            value={listName}
            onChangeText={setListName}
          />
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Close" color="red" onPress={onClose} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Add List" onPress={handleAddTaskList} />
            </View>
          </View>
         </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0, 0, 0, 0.5)" 
  },
  modalContent: { 
    width: 300, 
    height:200,
    padding: 20,
    backgroundColor: "white", 
    borderRadius: 10, 
    alignItems: "center" ,
    justifyContent: "center"
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  input: { 
    width: "100%", 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 ,
    fontSize: 16
  },
  buttonRow: { 
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1, // Butonları eşit genişlikte yapar
    marginHorizontal: 5, // Butonlar arasına boşluk ekler
    borderRadius: 5, 
    overflow: 'hidden'
  },
});

/*
  input: {
    width: '90%',
    padding: 0,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginBottom: 20,
  },
 */




