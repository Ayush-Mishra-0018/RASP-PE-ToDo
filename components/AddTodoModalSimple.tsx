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
    console.log('=== ADD TODO DEBUG ===');
    console.log('Task entered:', task);
    console.log('Task length:', task.length);
    console.log('Task trimmed:', task.trim());
    console.log('Task trimmed length:', task.trim().length);
    
    if (!task.trim()) {
      console.log('Task validation failed - showing alert');
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    console.log('Creating new todo...');
    
    // Safe date handling - always use valid dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let startDateObj = today;
    let endDateObj = tomorrow;

    // Try to parse user input dates, but fall back to defaults if invalid
    if (startDate.trim()) {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        startDateObj = parsedStart;
        console.log('Using custom start date:', parsedStart);
      } else {
        console.log('Invalid start date, using today as default');
      }
    }

    if (endDate.trim()) {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        endDateObj = parsedEnd;
        console.log('Using custom end date:', parsedEnd);
      } else {
        console.log('Invalid end date, using tomorrow as default');
      }
    }

    // Ensure end date is not before start date
    if (startDateObj > endDateObj) {
      console.log('Start date after end date, adjusting end date');
      endDateObj = new Date(startDateObj);
      endDateObj.setDate(startDateObj.getDate() + 1);
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      user_id: 'user1',
      task: task.trim(),
      status: TaskStatus.PENDING,
      start_date: startDateObj,
      end_date: endDateObj,
    };

    console.log('New Todo object:', JSON.stringify(newTodo, null, 2));
    console.log('Calling onAddTodo callback...');
    
    try {
      onAddTodo(newTodo);
      console.log('onAddTodo completed successfully');
      
      // Reset form
      console.log('Resetting form...');
      setTask('');
      setStartDate('');
      setEndDate('');
      
      console.log('Closing modal...');
      onClose();
      console.log('=== ADD TODO COMPLETE ===');
    } catch (error) {
      console.error('Error in onAddTodo:', error);
    }
  };

  const handleClose = () => {
    console.log('Modal closing...');
    setTask('');
    setStartDate('');
    setEndDate('');
    onClose();
  };

  console.log('Modal render - visible:', visible, 'task:', task);

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
            onChangeText={(text) => {
              console.log('Text input changed:', text);
              setTask(text);
            }}
            multiline
            numberOfLines={3}
          />
          
          <Text style={styles.sectionTitle}>Dates (Optional)</Text>
          <Text style={styles.dateHint}>Leave empty to use today/tomorrow as defaults</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Start Date (MM/DD/YYYY or YYYY-MM-DD)"
            value={startDate}
            onChangeText={(text) => {
              console.log('Start date changed:', text);
              setStartDate(text);
            }}
          />
          
          <TextInput
            style={styles.input}
            placeholder="End Date (MM/DD/YYYY or YYYY-MM-DD)"
            value={endDate}
            onChangeText={(text) => {
              console.log('End date changed:', text);
              setEndDate(text);
            }}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                console.log('Cancel button pressed');
                handleClose();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={() => {
                console.log('Add Task button pressed');
                handleAddTodo();
              }}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 8,
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
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