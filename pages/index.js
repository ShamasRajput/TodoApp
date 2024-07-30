import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TodoInput from '../components/TodoInput';
import Calendar from '../components/Calendar';
import { addTodo, toggleTodo, deleteTodo, updateTodo } from '../redux/todoSlice';

const Home = () => {
    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.todos);
    const taskCount = todos.length;


    const handleAddTodo = (text, attachment) => {
        dispatch(addTodo({ text, attachment }));
    };

    const handleToggleTodo = (id) => {
        dispatch(toggleTodo(id));
    };

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id));
    };

    const handleUpdateTodo = (id, text, attachment) => {
        dispatch(updateTodo({ id, text, attachment }));
    };

    return (
        <Layout>
            <Header taskCount={taskCount}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TodoInput onAdd={handleAddTodo} />
                    <h2 className="text-xl font-bold mb-4">All Tasks</h2>
                    <TaskList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onEdit={handleUpdateTodo} />
                </div>
                <div>
                    <Calendar />
                </div>
            </div>
            </Layout>
    );
};

export default Home;
