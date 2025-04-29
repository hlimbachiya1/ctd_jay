import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  const handleAddTodo = (newTodo) => {
    const todoWithCompletion = { ...newTodo, isCompleted: false };
    setTodoList([...todoList, todoWithCompletion]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1> My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} /> {/* Pass the function */}
      <TodoList
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}/>
        {' '}
      {/* Pass todoList as prop */}
    </div>
  );
}

export default App;
