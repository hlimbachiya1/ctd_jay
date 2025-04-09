import './App.css' 
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';  
import { useState } from 'react'; 

function App() {
    const [todoList, setTodoList] = useState([]);

    const handleAddTodo = (newTodo) => {
	setTodoList([...todoList, newTodo]);
    };

    return (
        <div>
            <h1> My Todos</h1>
            <TodoForm onAddTodo={handleAddTodo} />  {/* Pass the function */}
            
            <TodoList todoList={todoList}/>  {/* Pass todoList as prop */}
        </div>
    ) 
}  

export default App