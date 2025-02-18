import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
    text: string;
    completed: boolean;
    onToggleComplete: () => void;
    date?: Date | null ;
    time?: Date | null ;
};
  
export default function Task({text,completed,onToggleComplete,date,time}: Props){

    console.log("taskd",date);
    console.log(time);

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <TouchableOpacity onPress={onToggleComplete}>
                    <MaterialIcons 
                        name={completed ? 'check-box' : 'check-box-outline-blank'} 
                        size={30} 
                        color={completed ? '#4CAF50' : '#55BCF6'} 
                    />
                </TouchableOpacity>
                <Text style={[styles.itemText, completed && styles.completedText]}>
                    {text}
                </Text>
                {date && <Text style={styles.dateText}>{date.toDateString()}</Text>}
                {time && <Text style={styles.timeText}>{time.toTimeString().slice(0, 5)}</Text>}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15,
    },
    itemText:{
        maxWidth: '90%',
        marginLeft: 5,
        fontSize: 16,
        marginRight: 5,
    },
    circular: {
        width: 12,
        height: 12,
        backgroundColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5,
    },
    completedSquare: {
        backgroundColor: '#4CAF50',
        opacity: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#808080',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 5,
    },
    timeText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 5,
    },
});