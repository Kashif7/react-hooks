import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useMemo,
  useContext
} from "react";

import { Container, List } from "./Styled";

import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";
import About from "./About";
import ThemeContext from "../Theme/ThemeContext";

const useLocalStorage = (key, initialValue, initialCallback) => {
  const getInitialStorage = () => {
    const savedStorage = JSON.parse(localStorage.getItem(key) || initialValue);

    if (initialCallback) {
      initialCallback(savedStorage);
    }

    return savedStorage;
  };
  const [storage, updateStorage] = useState(getInitialStorage);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storage));
  }, [key, storage]);

  return [storage, updateStorage];
};

const useTitle = title => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
};

const useKeyDown = (map, defaultValue) => {
  const [match, setMatch] = useState(defaultValue);

  const handleChange = useCallback(
    ({ key }) => {
      setMatch(prevMatch =>
        Object.keys(map).some(mapKey => mapKey === key) ? map[key] : prevMatch
      );
    },
    [map]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleChange);

    return () => document.removeEventListener("keydown", handleChange);
  }, [handleChange]);

  return [match, setMatch];
};

export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const [todos, dispatchTodos] = useTodosWithLocalStorage([]);

  const [showAbout, setShowAbout] = useKeyDown(
    { "?": true, Escape: false },
    false
  );

  const inCompleteTodos = todos.reduce(
    (ac, cur) => (!cur.completed ? ac + 1 : ac),
    0
  );

  useTitle(inCompleteTodos ? `Todos (${inCompleteTodos})` : `Todos`);

  const handleNewChange = e => {
    setNewTodo(e.target.value);
  };

  const handleNewSubmit = e => {
    e.preventDefault();
    dispatchTodos({
      type: "ADD_TODO",
      text: newTodo
    });

    setNewTodo("");
  };

  const handleDelete = React.useCallback(
    (id, e) => {
      dispatchTodos({
        type: "REMOVE_TODO",
        id
      });
    },
    [dispatchTodos]
  );

  const handleCompletedToggle = React.useCallback(
    (id, e) => {
      dispatchTodos({ type: "TOGGLE_TODO", id });
    },
    [dispatchTodos]
  );

  const theme = useContext(ThemeContext);

  return (
    <Container todos={todos}>
      <NewTodo
        onSubmit={handleNewSubmit}
        value={newTodo}
        onChange={handleNewChange}
      />
      {!!todos.length && (
        <List theme={theme}>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onChange={handleCompletedToggle}
              onDelete={handleDelete}
            />
          ))}
        </List>
      )}
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </Container>
  );
}

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      this.current = this.current + 1;
      console.log("this.current", this.current);
      return [
        ...state,
        { id: this.current, text: action.text, completed: false }
      ];
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.id);
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.id
          ? {
              ...todo,
              completed: !todo.completed
            }
          : todo
      );
    default:
      return state;
  }
}

const useTodosWithLocalStorage = defaultValue => {
  const todoId = useRef(0);
  const initialValue = () => {
    const valueFromStorage = JSON.parse(
      localStorage.getItem("todos") || JSON.stringify(defaultValue)
    );

    todoId.current = valueFromStorage.reduce(
      (ac, cur) => Math.max(ac, cur.id),
      0
    );

    return valueFromStorage;
  };

  const [todos, dispatchTodos] = useReducer(
    useMemo(() => todoReducer.bind(todoId), [todoId]),
    useMemo(initialValue, [])
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return [todos, dispatchTodos];
};
