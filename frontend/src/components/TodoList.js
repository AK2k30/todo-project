import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const publishLatest = () => {
    axios.get('https://grocery-todo-backend.onrender.com/get-todos')
    .then(function (response) {
      console.log(response.data.data);
      setTodos(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
    publishLatest();
  }, [])

  const addTodo = todo => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('item_name', todo.text);
    axios({
      method: "post",
      url: "https://grocery-todo-backend.onrender.com/add-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('item_id', todoId);
    bodyFormData.append('item_name', newValue.text);
    axios({
      method: "post",
      url: "https://grocery-todo-backend.onrender.com/update-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const removeTodo = id => {
    var bodyFormData = new FormData();
    bodyFormData.append('item_id', id);
    axios({
      method: "post",
      url: "https://grocery-todo-backend.onrender.com/remove-todo",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        console.log(response);
        publishLatest();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const removeAllTodos = () => {
    setTodos([]);
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