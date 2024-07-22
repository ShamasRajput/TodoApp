// pages/completed.js
import React from 'react';
import Link from 'next/link';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';

const CompletedTasks = () => {
    const { todos, toggleTodo, deleteTodo } = useTodos();
    const completedTodos = todos.filter(todo => todo.completed);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Completed Tasks</h1>
            <nav>
                <Link href="/">Home</Link> | <Link href="/all">All Tasks</Link> | <Link href="/pending">Pending Tasks</Link>
            </nav>
            <TodoList todos={completedTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default CompletedTasks;
