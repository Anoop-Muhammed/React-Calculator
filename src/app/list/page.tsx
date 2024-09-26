import React from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

const TodoList = async () => {
  const todos: Todo[] = await fetchTodos();

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? 'Completed' : 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;