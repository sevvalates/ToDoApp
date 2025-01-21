import React from 'react';
import {StyleSheet, ScrollView, Text, View } from 'react-native';
import Task from '@/components/Task';
import { useTaskContext } from '@/components/TaskContext';

export default function CompletedTasks() {
  const { taskItems, setTaskItems } = useTaskContext();

  const completedTasks = taskItems.filter(task => task.completed);

  const toggleTaskCompletion = (taskId: number) => {
    const updatedTasks = taskItems.map(item => 
        item.id === taskId ? { ...item, completed: !item.completed } : item
    );
    setTaskItems(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        
        <ScrollView style={styles.items}>
            {completedTasks.length === 0 ? (
                <Text>No completed tasks</Text>
            ) : (
                completedTasks.map((task) => (
                <Task key={task.id} text={task.text} completed={task.completed} onToggleComplete={() => toggleTaskCompletion(task.id)}/>
                ))
            )}
        </ScrollView>
      </View>
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