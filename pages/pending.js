import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';
import { toggleTodo, deleteTodo } from '../redux/todoSlice';

const PendingTasks = () => {
    const dispatch = useDispatch();
    const filteredTodos = useSelector((state) => state.todos.filteredTodos);

    const pendingTodos = JSON.parse(JSON.stringify(filteredTodos)).filter(filteredTodos => !filteredTodos.completed);
    const taskCount = pendingTodos.length;


    const handleToggleTodo = (id) => {
        dispatch(toggleTodo(id));
    };

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id));
    };

    return (
        <Layout>
            <Header taskCount={taskCount}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
                    <TaskList todos={pendingTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
                </div>
                <div>
                    <Calendar />
                </div>
            </div>
        </Layout>
    );
};

export default PendingTasks;
