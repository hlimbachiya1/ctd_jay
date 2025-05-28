const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',
  clearError: 'clearError',
};

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };

    case actions.loadTodos: {
      const fetchedTodos = action.records.map((record) => {
        const todo = {
          id: record.id,
          ...record.fields,
        };

        if (!todo.isCompleted) {
          todo.isCompleted = false;
        }
        return todo;
      });
      return {
        ...state,
        todoList: fetchedTodos,
        isLoading: false,
      };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
      const savedTodo = {
        id: action.records[0].id,
        ...action.records[0].fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.updateTodo: {
      const updatedTodoList = state.todoList.map((todo) => {
        if (todo.id === action.editedTodo.id) {
          return action.editedTodo;
        }
        return todo;
      });
      return {
        ...state,
        todoList: updatedTodoList,
      };
    }

    case actions.completeTodo: {
      const completedTodoList = state.todoList.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, isCompleted: true };
        }
        return todo;
      });
      return {
        ...state,
        todoList: completedTodoList,
      };
    }

    case actions.revertTodo: {
      const revertedTodos = state.todoList.map((todo) => {
        if (todo.id === action.originalTodo.id) {
          return action.originalTodo;
        }
        return todo;
      });
      return {
        ...state,
        todoList: revertedTodos,
      };
    }
    
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
    default:
      return state;
  }
}

export {initialState, actions, reducer};
