import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
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

  return (
    <div>
      <h1> My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} /> {/* Pass the function */}
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />{' '}
      {/* Pass todoList as prop */}
    </div>
  );
}

export default App;
