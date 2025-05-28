import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState, useEffect, useCallback, useReducer } from 'react';
import TodosViewForm from './features/TodosViewForm';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';

function App() {
  // const [todoList, setTodoList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const encodedUrl = encodeUrl();
        const resp = await fetch(encodedUrl, options);

        if (!resp.ok) {
          const errorText = await resp.text();
          console.error('Fetch error details:', errorText);
          throw new Error(
            `${resp.statusText || 'Failed to fetch todos'}: ${errorText}`
          );
        }

        const data = await resp.json();
        dispatch({
          type: todoActions.loadTodos,
          records: data.records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error: error,
        });
        console.error(error);
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

  const handleAddTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: false,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      dispatch({ type: todoActions.startRequest });

      const encodedUrl = encodeUrl();
      const resp = await fetch(encodedUrl, options);

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to save todo');
      }

      const { records } = await resp.json();
      dispatch({
        type: todoActions.addTodo,
        records: records,
      });
    } catch (error) {
      console.error(error);

      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    const todoToComplete = todoState.todoList.find((todo) => todo.id === id);
    const originalTodo = { ...todoToComplete };
    dispatch({
      type: todoActions.completeTodo,
      id: id,
    });

    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: todoToComplete.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const encodedUrl = encodeUrl();
      const resp = await fetch(encodedUrl, options);

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to complete todo');
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoState.todoList.find(
      (todo) => todo.id === editedTodo.id
    );
    dispatch({
      type: todoActions.updateTodo,
      editedTodo: editedTodo,
    });

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const encodedUrl = encodeUrl();
      const resp = await fetch(encodedUrl, options);

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to update todo');
      }
    } catch (error) {
      console.error(error);
      //setErrorMessage(`${error.message}. Reverting todo...`);
      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <img
          src="./todo-logo-svg.svg"
          alt="Todo Logo"
          width="50"
          height="50"
          style={{ marginRight: '1rem' }}
        />
        <h1>My Todos</h1>
      </div>
      <TodoForm onAddTodo={handleAddTodo} isSaving={todoState.isSaving} />
      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
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

export default App;
