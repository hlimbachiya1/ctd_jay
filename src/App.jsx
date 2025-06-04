import './App.css';
import styles from './App.module.css';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { Routes, Route, useLocation } from 'react-router';

import Header from './shared/Header.jsx';
import TodosPage from './pages/TodosPage.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const [title, setTitle] = useState('Todo List');
  const location = useLocation();

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Todo List');
        break;
      case '/about':
        setTitle('About');
        break;
      default:
        setTitle('Not Found');
    }
  }, [location]);

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

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
  }, [encodeUrl]);

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
    } finally {
      dispatch({ type: todoActions.endRequest });
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

      dispatch({
        type: todoActions.setLoadError,
        error: error,
      });
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodo,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  return (
    <div className={styles.container}>
      <Header title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoState={todoState}
              dispatch={dispatch}
              handleAddTodo={handleAddTodo}
              completeTodo={completeTodo}
              updateTodo={updateTodo}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              queryString={queryString}
              setQueryString={setQueryString}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
