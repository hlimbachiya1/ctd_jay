import './App.css' 
import TodoList from './TodoList.jsx'  // Added ./ at the beginning
import TodoForm from './TodoForm.jsx';  // Added ./ at the beginning

function App() {
    //todos array moved to TodoList.jx file
    
    return (
        <div>
            <h1> My Todos</h1>
            <TodoForm />  {/* TodoForm component */}
            <TodoList />  {/* TodoList component */}
        </div>
    ) 
}  

export default App