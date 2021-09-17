import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Modal, TextInput } from 'react-native';
import { DataStore } from 'aws-amplify';
import { Todo } from './models';

export default function Home() {

  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const onQuery = async () => {
      const todos_list = await DataStore.query(Todo);
      setTodos(todos_list);
    };

    //load todos on first render 
    onQuery();

    const subscription = DataStore.observe(Todo).subscribe((msg) => {
      onQuery();
    });

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

  async function addTodo() {
    await DataStore.save(new Todo({
      name: todoName,
      description: todoDescription,
      isComplete: false
    }));
    setModalVisible(false);
    setTodoName("");
    setTodoDescription("");
  }

  const todoItem = ({ item }) => (
    <View style={styles.todoContainer}>
      <View>
        <Text style={styles.todoHeading}>{item.name}</Text>
        <Text style={styles.todoDescription}>{item.description}</Text>
      </View>
      <Pressable
        style={[styles.checkbox, item.isComplete && styles.selectedCheckbox]}
        onPress={() => {
          setComplete(!item.isComplete, item)
        }}
      >
        <Text style={[styles.checkboxText, item.isComplete && styles.selectedCheckboxText]}>{(item.isComplete) ? "✓" : ""}</Text>
      </Pressable>
    </View >
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <Pressable style={styles.modalDismiss}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={styles.modalDismissText}>X</Text></Pressable>
          <TextInput
            style={styles.inputView}
            placeholder="Name"
            placeholderTextColor="black"
            onChangeText={setTodoName}
          />
          <TextInput
            style={styles.inputView}
            placeholder="Description"
            placeholderTextColor="black"
            onChangeText={setTodoDescription}
          />
          <Pressable style={styles.buttonContainer} onPress={addTodo}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </Modal>
      <FlatList
        data={todos}
        renderItem={todoItem}
        keyExtractor={item => item.id}
      />
      <Pressable
        style={[styles.buttonContainer, styles.floatingButton]}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.buttonText}>+ Add Todo</Text>
      </Pressable>
    </View>
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
    padding: 15,
    alignSelf: "center",
    color: "#fff"
  },
  buttonContainer: {
    backgroundColor: "#4696ec",
    width: 150,
    alignSelf: "center",
    borderRadius: 25,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 20,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
  },
  inputView: {
    height: 40,
    margin: 15,
    borderWidth: 1,
    padding: 10,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "#000",
    width: 325,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginTop: 300
  },
  modalDismiss: {
    position: "absolute",
    right: 20,
    top: 15
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: "600"
  }
});
