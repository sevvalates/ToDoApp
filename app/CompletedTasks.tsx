import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

type TaskItem = {
    text: string;
    completed: boolean;
};

type Props = {
    tasks: TaskItem[];
};

export default function CompletedTasks({ tasks }: Props) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {tasks.map((task, index) => (
                    <View key={index} style={styles.task}>
                        <Text style={styles.taskText}>{task.text}</Text>
                    </View>
                ))}
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E8EAED',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        marginTop: 10,
    },
    task: {
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
    },
    taskText: {
        fontSize: 16,
    },
});
