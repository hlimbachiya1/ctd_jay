import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';


const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const StyledButton = styled.button`
  margin-top: 0.75rem;
  &:disabled {
    font-style: italic;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        ref={todoTitleInput}
        value={workingTodo}
        onChange={(e) => setWorkingTodo(e.target.value)}
      />
      <StyledButton type="submit" disabled={workingTodo === '' || isSaving}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
