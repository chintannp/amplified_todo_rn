import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
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

    return (
        <ScrollView contentContainerStyle={styles.listContainer} >
            {todos.map((todo, i) => (
                <View key={i} style={styles.todoContainer}>
                    <View>
                        <Text style={styles.todoHeading} >{`${todo.name} `}</Text>
                        <Text style={styles.todoDescription} >{`${todo.description} `}</Text>
                    </View>
                    <Switch
                        style={styles.switch}
                        trackColor={{ false: "#767577", true: "#4696ec" }}
                        thumbColor={"#fff"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(updateValue) => { setComplete(updateValue, todo) }}
                        value={todo.isComplete}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    todoContainer: {
        margin: 10,
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
    switch: {
        alignSelf: "center",
        margin: 10
    },
    todoHeading: {
        fontSize: 20,
        fontWeight: "600",
        padding: 5,
    },
    todoDescription: {
        padding: 5,
    },
});
