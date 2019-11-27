import React, { useState, useEffect, useRef, useCallback } from "react";

import { Container, List } from "./Styled";

import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";
import About from "./About";

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
  const todoId = useRef(0);

  const [newTodo, setNewTodo] = useState("");

  const [todos, updateTodos] = useLocalStorage("todos", "[]", newTodos => {
    todoId.current = newTodos.reduce((ac, cur) => Math.max(ac, cur), 0);
  });

  const [showAbout, setShowAbout] = useKeyDown(
    { "?": true, "Escape": false },
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
    todoId.current += 1;
    e.preventDefault();
    updateTodos(prevTodos => [
      ...prevTodos,
      {
        id: todoId.current,
        text: newTodo,
        completed: false
      }
    ]);

    setNewTodo("");
  };

  const handleDelete = (id, e) => {
    updateTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleCompletedToggle = (id, e) => {
    updateTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed
            }
          : todo
      )
    );
  };

  return (
    <Container todos={todos}>
      <NewTodo
        onSubmit={handleNewSubmit}
        value={newTodo}
        onChange={handleNewChange}
      />
      {!!todos.length && (
        <List>
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
