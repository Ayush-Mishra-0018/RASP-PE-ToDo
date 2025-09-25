import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Todo, TaskStatus } from '../types/todo';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTodo: (todo: Todo) => void;
}

export default function AddTodoModal({ visible, onClose, onAddTodo }: AddTodoModalProps) {
  const [task, setTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddTodo = () => {
    console.log('handleAddTodo called');
    console.log('Task:', task);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    
    if (!task.trim()) {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    // Use default dates if not provided
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let startDateObj = today;
    let endDateObj = tomorrow;

    // If dates are provided, validate them
    if (startDate.trim()) {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        Alert.alert('Error', 'Please enter a valid start date (MM/DD/YYYY)');
        return;
      }
    }

    if (endDate.trim()) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        Alert.alert('Error', 'Please enter a valid end date (MM/DD/YYYY)');
        return;
      }
    }

    if (startDateObj > endDateObj) {
      Alert.alert('Error', 'Start date cannot be after end date');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      user_id: 'user1', // Since we don't have backend, using a default user_id
      task: task.trim(),
      status: TaskStatus.PENDING,
      start_date: startDateObj,
      end_date: endDateObj,
    };

    console.log('New Todo created:', newTodo);
    console.log('Calling onAddTodo...');
    onAddTodo(newTodo);
    console.log('onAddTodo called successfully');
    
    // Reset form
    setTask('');
    setStartDate('');
    setEndDate('');
    console.log('About to close modal...');
    onClose();
  };

  const handleClose = () => {
    setTask('');
    setStartDate('');
    setEndDate('');
    onClose();
  };

  console.log('Modal visible:', visible);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add New Task</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter task description"
            value={task}
            onChangeText={setTask}
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Start Date (Optional - MM/DD/YYYY)"
            value={startDate}
            onChangeText={setStartDate}
          />
          
          <TextInput
            style={styles.input}
            placeholder="End Date (Optional - MM/DD/YYYY)"
            value={endDate}
            onChangeText={setEndDate}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddTodo}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});