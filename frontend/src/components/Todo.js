import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine, RiDeleteBin2Line } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, removeTodo, updateTodo, removeAllTodos }) => {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const submitUpdate = value => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return (
    <>
      <div className="delete-all-container">
        <button 
          onClick={removeAllTodos}
          className="delete-all-btn"
        >
          <RiDeleteBin2Line className="delete-all-icon" />
          Delete All
        </button>
      </div>
      {todos.map((todo, index) => (
        <div
          className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
          key={index}
        >
          <div key={todo.id}>
            {todo.text}
          </div>
          <div className='icons'>
            <RiCloseCircleLine
              onClick={() => removeTodo(todo.id)}
              className='delete-icon'
            />
            <TiEdit
              onClick={() => setEdit({ id: todo.id, value: todo.text })}
              className='edit-icon'
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Todo;