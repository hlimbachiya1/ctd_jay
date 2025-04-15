import { useRef, useState } from 'react';

function TodoForm({ onAddTodo }) {

    const todoTitleInput = useRef(); 
    const [workingTodo, setWorkingTodo] = useState('');

    function handleAddTodo(event) {
        event.preventDefault();

        const newTodo = {
            id: Date.now(),
            title: workingTodo
        };

        onAddTodo(newTodo);         // calling parent function
        setWorkingTodo('');         // clear input after submission
        todoTitleInput.current.focus();  // Refocus the input
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input 
                type="text" 
                id="todoTitle" 
                name = "title" 
                ref = {todoTitleInput} 
                value = {workingTodo}
                onChange={(e) => setWorkingTodo(e.target.value)}
            />
            <button type="submit" disabled={workingTodo === ''}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
