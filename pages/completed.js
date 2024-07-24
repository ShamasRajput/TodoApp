import React from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TodoInput from '../components/TodoInput';
import Calendar from '../components/Calendar';
import { useTodos } from '../context/TodoContext';

const CompletedTasks = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const completedTodos = todos.filter(todo => todo.completed);
    const taskCount = completedTodos.length;

    return (
        <Layout>
            <Header taskCount={taskCount} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TodoInput onAdd={addTodo} />
                    <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
                    <TaskList todos={completedTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
                </div>
                <div>
                    <Calendar />
                </div>
            </div>
        </Layout>
    );
};

export default CompletedTasks;
