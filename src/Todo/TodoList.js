import React, { useState, useEffect, useRef } from "react";

import { Container, List } from "./Styled";

import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";
import About from "./About";

export default function TodoList() {
  const todoId = useRef(0);

  const [newTodo, setNewTodo] = useState("");

  const getInitialTodos = () => {
    const valuesFromStorage = JSON.parse(localStorage.getItem("todos") || "[]");

    todoId.current = valuesFromStorage.reduce(
      (ac, cur) => Math.max(ac, cur.id),
      0
    );

    return valuesFromStorage;
  };
  const [todos, updateTodos] = useState(getInitialTodos);

  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const inCompleteTodos = todos.reduce(
      (ac, cur) => (!cur.completed ? ac + 1 : ac),
      0
    );

    document.title = inCompleteTodos ? `Todos (${inCompleteTodos})` : `Todos`;
  });

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

  const handleKey = ({ key }) => {
    setShowAbout(prevShowAbout =>
      key === "?" ? true : key === "Escape" ? false : prevShowAbout
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
