import './App.css' 
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';  
import { useState } from 'react'; // Import useState

function App() {
    // Add state for new todolistitem with initial value
    const [newTodo, setNewTodo] = useState("Example State");

    return (
        <div>
            <h1> My Todos</h1>
            <TodoForm />  {/* TodoForm component */}
            <p>{newTodo}</p>
            <TodoList />  {/* TodoList component */}
        </div>
    ) 
}  

export default App