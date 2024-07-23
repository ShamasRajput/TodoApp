// pages/pending.js
import React from 'react';
import Link from 'next/link';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';

const PendingTasks = () => {    
    const { todos, toggleTodo, deleteTodo } = useTodos();
    const pendingTodos = todos.filter(todo => !todo.completed);

    return (
        <div className="container">
            <h1 className='text-centre my-4'>Todo App</h1>
            <nav className="nav justify-content-centre mb-4">
                <Link href="/" legacyBehavior>
                    <a>All Tasks</a>
                </Link>
                <Link href="/completed" legacyBehavior>
                    <a>Completed Tasks</a>
                </Link>
                <Link href="/pending" legacyBehavior>
                    <a className="active">Pending Tasks</a>
                </Link>
            </nav>
            <TodoList todos={pendingTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default PendingTasks;
