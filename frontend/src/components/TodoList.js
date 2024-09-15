import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const API_BASE_URL = 'https://flask-backend-0ydk.onrender.com/';

  const fetchTasks = () => {
    axios.get(`${API_BASE_URL}/tasks`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }

  useEffect(() => {
    fetchTasks();
  }, [])

  const addTodo = todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    axios.post(`${API_BASE_URL}/tasks`, { name: todo.text })
      .then(response => {
        console.log(response.data);
        fetchTasks();
      })
      .catch(error => {
        console.error('Error adding task:', error);
      });
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    axios.put(`${API_BASE_URL}/tasks/${todoId}`, { name: newValue.text })
      .then(response => {
        console.log(response.data);
        fetchTasks();
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const removeTodo = id => {
    axios.delete(`${API_BASE_URL}/tasks/${id}`)
      .then(response => {
        console.log('Task deleted');
        fetchTasks();
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const removeAllTodos = () => {
    axios.delete(`${API_BASE_URL}/tasks`)
      .then(response => {
        console.log('All tasks deleted');
        fetchTasks();
      })
      .catch(error => {
        console.error('Error deleting all tasks:', error);
      });
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        removeAllTodos={removeAllTodos}
      />
    </>
  );
}

export default TodoList;