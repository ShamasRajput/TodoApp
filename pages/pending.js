// pages/pending.js
import React from 'react';
import Link from 'next/link';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';

const PendingTasks = () => {    
    const { todos, toggleTodo, deleteTodo } = useTodos();
    const pendingTodos = todos.filter(todo => !todo.completed);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Pending Tasks</h1>
            <nav>
                <Link href="/">Home</Link> | <Link href="/all">All Tasks</Link> | <Link href="/completed">Completed Tasks</Link>
            </nav>
            <TodoList todos={pendingTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default PendingTasks;
