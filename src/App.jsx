import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState, useEffect } from 'react';
import TodosViewForm from './features/TodosViewForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = ({ sortField, sortDirection, queryString }) => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
    }
    
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        //const encodedUrl; // = encodeUrl({ sortField, sortDirection, queryString });
        const resp = await fetch(encodeUrl({ sortDirection, sortField, queryString }),options);
        
        //const resp = await fetch(url, options);
        //const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);
        console.log("response:", resp);

        if (!resp.ok) {
          throw new Error(resp.statusText || 'Failed to fetch todos');
        }

        const data = await resp.json();
        console.log("data:", data);
        const fetchedTodos = data.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };

          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }

          return todo;
        });

        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
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
            //createdTime: new Date().toISOString()
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
      setIsSaving(true);
      //const encodedUrl = encodeUrl({ sortField, sortDirection, queryString });
      const encodedUrl = encodeUrl({ sortField, sortDirection, queryString });
      
      console.log("check send req.;", encodeUrl, payload);
      console.log("check body/payload:", options.body);
      
      const resp = await fetch(encodedUrl, options);
      

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to save todo');
      }

      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const todoToComplete = todoList.find((todo) => todo.id === id);
    const originalTodo = { ...todoToComplete };

    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });

    setTodoList([...updatedTodoList]);

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
      const resp = await fetch(encodeUrl, options);

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to complete todo');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) => {
        if (todo.id === id) {
          return originalTodo;
        }
        return todo;
      });

      setTodoList([...revertedTodos]);
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const updatedTodoList = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });

    setTodoList([...updatedTodoList]);

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
      const resp = await fetch(encodeUrl, options);

      if (!resp.ok) {
        throw new Error(resp.statusText || 'Failed to update todo');
      }

      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) => {
        if (todo.id === originalTodo.id) {
          return originalTodo;
        }
        return todo;
      });

      setTodoList([...revertedTodos]);
    }
  };

  return (
    <div>
      <h1> My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
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

      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;