import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Todo, TaskStatus } from '../types/todo';
import TodoItem from '../components/TodoItem';
import AddTodoModal from '../components/AddTodoModalSimple';

const API_BASE_URL = 'http://localhost:8082';

export default function TodoScreen({ navigation }: { navigation: any }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const ssid = sessionStorage.getItem("key");
    if (!ssid) {
      // Generate a dummy session ID for testing
      const dummySessionId = "12345"; // Or use crypto.randomUUID()
      sessionStorage.setItem("key", dummySessionId);
      console.log("Generated dummy Session ID:", dummySessionId);
    }
    fetchTodos();
  }, [navigation]);

  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams();
      params.append("queryId", "GET_ALL");
      const ssid = sessionStorage.getItem("key");
      console.log("Session Id in API: ", ssid);

      if (!ssid) {
        Alert.alert("Error", "Session ID not found.");
        return;
      }

      params.append("session_id", ssid);
      const response = await fetch(`${API_BASE_URL}/api/todo?${params.toString()}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Response status:", response.status);
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData.message || "Failed to fetch todos");
      }
      const todosArray = Array.isArray(jsonData.resource) ? jsonData.resource : [];
      setTodos(todosArray);
    } catch (error) {
      Alert.alert("Error", "Unable to load todos. Please try again.");
      console.error("Fetch error:", error);
    }
  };

  const handleAddTodo = async (newTodo: Todo) => {
    try {
      const params = new URLSearchParams();
      const jsonString = JSON.stringify(newTodo);
      const base64Encoded = btoa(jsonString);
      params.append("resource", base64Encoded);
      const ssid = sessionStorage.getItem("key");
      if (!ssid) {
        Alert.alert("Error", "Session ID not found.");
        return;
      }
      params.append("session_id", ssid);

      const response = await fetch(`${API_BASE_URL}/api/todo?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) throw new Error("Failed to add todo");
      const jsonData = await response.json();
      if (jsonData.errCode === 0) {
        const addedTodo = jsonData.resource;
        setTodos(prevTodos => [...prevTodos, addedTodo]);
      } else {
        throw new Error(jsonData.message || "Failed to add todo");
      }
    } catch (error) {
      console.error("Add error:", error);
      Alert.alert("Error", "Failed to add todo. Please try again.");
    } finally {
      setModalVisible(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedStatus = todoToUpdate.status === TaskStatus.COMPLETED
      ? TaskStatus.PENDING
      : TaskStatus.COMPLETED;
    const updatedTodo = { ...todoToUpdate, status: updatedStatus };

    try {
      const params = new URLSearchParams();
      const jsonString = JSON.stringify(updatedTodo);
      const base64Encoded = btoa(jsonString);
      params.append("resource", base64Encoded);
      const ssid = sessionStorage.getItem("key");
      if (!ssid) {
        Alert.alert("Error", "Session ID not found.");
        return;
      }
      params.append("session_id", ssid);
      params.append("action", "MODIFY");

      const response = await fetch(`${API_BASE_URL}/api/todo/${id}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) throw new Error("Failed to update todo");
      const jsonData = await response.json();
      if (jsonData.errCode === 0) {
        const updatedTodoData = jsonData.resource;
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? updatedTodoData : todo
          )
        );
      } else {
        throw new Error(jsonData.message || "Failed to update todo");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update todo. Please try again.");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem("key");
      if (!ssid) {
        Alert.alert("Error", "Session ID not found.");
        return;
      }
      params.append("session_id", ssid);
      params.append("action", "DELETE");
      const jsonString = JSON.stringify({ id });
      const base64Encoded = btoa(jsonString);
      params.append("resource", base64Encoded);

      const response = await fetch(`${API_BASE_URL}/api/todo/${id}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) throw new Error("Failed to delete todo");
      const jsonData = await response.json();
      if (jsonData.errCode === 0) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } else {
        throw new Error(jsonData.message || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Failed to delete todo. Please try again.");
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDeleteTodo}
    />
  );

  const completedCount = todos.filter(todo => todo.status === TaskStatus.COMPLETED).length;
  const totalCount = todos.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todo List</Text>
        <Text style={styles.subtitle}>
          {completedCount} of {totalCount} completed
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('Add button pressed');
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Task</Text>
      </TouchableOpacity>

      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet!</Text>
          <Text style={styles.emptySubtext}>Tap "Add New Task" to get started</Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTodo={handleAddTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
});