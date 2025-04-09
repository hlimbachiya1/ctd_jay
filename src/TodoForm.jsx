import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
    
    const todoTitleInput = useRef(); 
    
    // Define handler exactly as given in assignment
    function handleAddTodo(event) {
        event.preventDefault();
        console.dir(event.target);
        
        const title = event.target.title.value;
        
        const newTodo = {
            id: Date.now(),
            title: title
        };
        
        onAddTodo(newTodo);  // calling parent function
        
        event.target.title.value = "";  // Clears input
        
        todoTitleInput.current.focus();  // Refocus the input
    }

    return (
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input type="text" id="todoTitle" 
        name = "title" ref = {todoTitleInput} />
        <button type="submit">Add Todo</button>
      </form>
    )
  }
  
  export default TodoForm