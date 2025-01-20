import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
    text: string;
    completed: boolean;
    onToggleComplete: () => void;
};
  
export default function Task({text,completed,onToggleComplete}: Props){
/*
return (
    <View style={styles.item}>
        <View style={styles.itemLeft}>
            <TouchableOpacity 
                style={[styles.square, completed && styles.completedSquare]} 
                onPress={onToggleComplete}
            />
            <Text style={[styles.itemText, completed && styles.completedText]}>
                {text}
            </Text>
        </View>
    </View>
);
*/  

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
        maxWidth: '80%',
        marginLeft: 5,
        fontSize: 16,
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
});