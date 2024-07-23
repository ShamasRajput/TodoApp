import React from 'react';
import Link from 'next/link';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import { useTodos } from '../context/TodoContext';
import { useRouter } from 'next/router';

const Home = () => {
    const { todos, addTodo, toggleTodo, deleteTodo, loading, error } = useTodos();
    const router = useRouter();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container">
            <h1 className='text-centre my-4'>Todo App</h1>
            <nav className="nav justify-content-centre mb-4">
                <Link href="/" legacyBehavior>
                    <a className={router.pathname === '/' ? 'active' : ''}>All Tasks</a>
                </Link>
                <Link href="/completed" legacyBehavior>
                    <a className={router.pathname === '/completed' ? 'active' : ''}>Completed Tasks</a>
                </Link>
                <Link href="/pending" legacyBehavior>
                    <a className={router.pathname === '/pending' ? 'active' : ''}>Pending Tasks</a>
                </Link>
            </nav>
            <TodoInput onAdd={addTodo} />
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
    );
};

export default Home;
