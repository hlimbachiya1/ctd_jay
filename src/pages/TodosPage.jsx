import { useSearchParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import { actions as todoActions } from '../reducers/todos.reducer';
import styles from './TodosPage.module.css';

function TodosPage({
  todoState,
  dispatch,
  handleAddTodo,
  completeTodo,
  updateTodo,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [SearchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const totalPages = Math.ceil(todoState.todoList.length / itemsPerPage);
  const currentPage = parseInt(SearchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;

  // this const is not mentioned in the assginment but i thought it is needed
  const currentTodos = todoState.todoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, navigate, totalPages]);

  return (
    <div>
      <TodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving} />

      <TodoList
        todoList={currentTodos}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />

      {todoState.todoList.length > itemsPerPage && (
        <div className={styles.paginationControls}>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            {' '}
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <hr />
      <TodosViewForm
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        sortField={sortField}
        setSortField={setSortField}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {todoState.errorMessage && (
        <div className={styles.errorContainer}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="./error-icon-svg.svg"
              alt="Error"
              width="24"
              height="24"
              style={{ marginRight: '0.5rem' }}
            />
            <hr />
            <p>{todoState.errorMessage}</p>
          </div>
          <hr />
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;
