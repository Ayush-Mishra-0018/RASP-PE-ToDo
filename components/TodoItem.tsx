import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Todo, TaskStatus } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  const isCompleted = todo.status === TaskStatus.COMPLETED;

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.todoContent}>
        <Text style={[styles.task, isCompleted && styles.completedTask]}>
          {todo.task}
        </Text>
        <Text style={styles.dates}>
          Start: {todo.start_date.toLocaleDateString()} | 
          End: {todo.end_date.toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton, isCompleted && styles.completedButton]}
          onPress={() => onToggleComplete(todo.id)}
        >
          <Text style={[styles.buttonText, isCompleted && styles.completedButtonText]}>
            {isCompleted ? '✓ Done' : 'Complete'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(todo.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
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
  completedContainer: {
    backgroundColor: '#e8f5e8',
  },
  todoContent: {
    flex: 1,
    marginRight: 12,
  },
  task: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  dates: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#007AFF',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  completedButtonText: {
    color: 'white',
  },
});