import React from 'react';
import Link from 'next/link';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';

const AllTasks = () => {
    const { todos, toggleTodo, deleteTodo } = useTodos();

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>All Tasks</h1>
            <nav>
                <Link href="/">Home</Link> | <Link href="/completed">Completed Tasks</Link> | <Link href="/pending">Pending Tasks</Link>
            </nav>  
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default AllTasks;
