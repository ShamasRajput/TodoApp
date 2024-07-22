import React from 'react';
import Link from 'next/link';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';

const Home = () => {
    const { todos, addTodo, toggleTodo, deleteTodo, loading, error } = useTodos();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h1>Todo App</h1>
            <nav>
                <Link href="/all">All Tasks</Link> | <Link href="/completed">Completed Tasks</Link> | <Link href="/pending">Pending Tasks</Link>
            </nav>
            <TodoInput onAdd={addTodo} />
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default Home;
