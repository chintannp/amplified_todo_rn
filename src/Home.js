import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Modal, TextInput, TouchableOpacity } from 'react-native';
import { DataStore } from 'aws-amplify';
import { Todo } from './models';

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Todo App</Text>
  </View>
)

const AddModal = ({ modalVisible, setModalVisible }) => {
  const [todoName, setTodoName] = useState("");
  const [todoDescription, setTodoDescription] = useState("");

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

  function closeModal() {
    setModalVisible(false);
  }

  return (<Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={closeModal}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.addTodoContainer}>
        <Pressable style={styles.modalDismissButton}
          onPress={closeModal}>
          <Text style={styles.modalDismissText}>X</Text></Pressable>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={setTodoName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={setTodoDescription}
        />
        <Pressable style={styles.buttonContainer} onPress={addTodo}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  </Modal>);
}

const TodoList = ({ todos }) => {

  async function deleteTodo(todo) {
    try {
      await DataStore.delete(todo);
    } catch (e) {
      console.log(`Delete failed: ${e}`);
    }
  }

  async function setComplete(updateValue, todo) {
    await DataStore.save(
      Todo.copyOf(todo, updated => {
        updated.isComplete = updateValue
      })
    );
  }

  const todoItem = ({item}) => (
    <Pressable style={styles.todoContainer}
      onLongPress={() => {
        deleteTodo(item);
      }}>
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
    </Pressable >
  )

  return (
    < FlatList
      data={todos}
      renderItem={todoItem}
      keyExtractor={item => item.id}
    />)
};


export default function Home() {

  const [todos, setTodos] = useState([]);
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

  return (
    <View style={styles.container}>
      <Header />
      <AddModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <TodoList todos={todos}/>
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
  headerContainer: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: '#4696ec',
  },
  headerTitle: {
    marginTop: 0,
    textAlign: "center",
    color: "white",
    fontSize: 24,
    fontWeight: "600"
  },
  container: {
    flex: 1,
    backgroundColor: "white"
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
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 20,
    elevation: 5,
    shadowOffset: {
      height: 3,
      width: 1
    }
  },
  input: {
    height: 40,
    margin: 15,
    borderWidth: 1,
    padding: 10,
  },
  addTodoContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignSelf: "center",
    justifyContent: "center",
    width: 325,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center'
  },
  modalDismissButton: {
    position: "absolute",
    right: 20,
    top: 15
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: "600"
  }
});
