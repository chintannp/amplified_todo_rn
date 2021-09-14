import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { DataStore } from 'aws-amplify';
import { Todo } from './models';

export default function Home() {

    const [todos, setTodos] = useState([]);

    let subscription;

    useEffect(() => {
        onQuery = async () => {
            const todos_list = await DataStore.query(Todo);
            setTodos(todos_list);
        };

        if (typeof subscription === 'undefined') {
            subscription = DataStore.observe(Todo).subscribe((msg) => {
                onQuery();
            });
        }

        return function cleanup() {
            subscription.unsubscribe();
        }
    }, []);

    async function setComplete(updateValue, todo) {
        await DataStore.save(
            Todo.copyOf(todo, updated => {
                updated.isComplete = updateValue
            })
        );
    }

    const todoItem = ({ item }) => (
        <View style={styles.todoContainer}>
            <View>
                <Text style={styles.todoHeading} >{item.name}</Text>
                <Text style={styles.todoDescription} >{item.description}</Text>
            </View>
            <TouchableOpacity
                style={[styles.checkbox, item.isComplete && styles.selectedCheckbox]}
                onPress={() => {
                    setComplete(!item.isComplete, item)
                }}
            >
                <Text style={[styles.checkboxText, item.isComplete && styles.selectedCheckboxText]}> {(item.isComplete) ? "✓" : ""} </Text>
            </TouchableOpacity>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={todos}
                renderItem={todoItem}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    todoContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    todoHeading: {
        fontSize: 20,
        fontWeight: "600",
        padding: 5,
    },
    todoDescription: {
        padding: 5,
    },
    checkbox: {
        alignSelf: "center",
        alignItems: "center",
        borderWidth: 2,
        height: 20,
        width: 20,
        margin: 10,
        borderRadius: 2,
    },
    checkboxText: {
        fontSize: 13,
        fontWeight: "700",
        alignSelf: 'center',
    },
    selectedCheckbox: {
        backgroundColor: "black"
    },
    selectedCheckboxText: {
        color: "white"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        padding: 5,
        alignSelf: "center",
        color: "#fff"
    },
    button: {
        backgroundColor: "#4696ec",
        width: 150,
        alignSelf: "center",
        borderRadius: 25,
        padding: 10,
        margin: 10,
        shadowOpacity: 0.3,
    },
});
