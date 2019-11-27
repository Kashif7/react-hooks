import React, { useState, useEffect } from "react";

import { Container, List } from "./Styled";

import NewTodo from "./NewTodo";
import TodoItem from "./TodoItem";
import About from "./About";


export default function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const getInitialTodos = () => JSON.parse(localStorage.getItem("todos") || "[]");

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
    e.preventDefault();
    updateTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now(),
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
      <About
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </Container>
  );
}
