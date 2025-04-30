import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef();
  const [workingTodo, setWorkingTodo] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();

    const newTodo = {
      id: Date.now(),
      title: workingTodo,
    };

    onAddTodo(newTodo);
    setWorkingTodo('');
    todoTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        ref={todoTitleInput}
        value={workingTodo}
        onChange={(e) => setWorkingTodo(e.target.value)}
      />
      <button type="submit" disabled={workingTodo === '' || isSaving}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
