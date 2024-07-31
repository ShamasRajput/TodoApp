    import React, { useState, useEffect } from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import Layout from '../components/Layout';
    import Header from '../components/Header';
    import TaskList from '../components/TaskList';
    import TodoInput from '../components/TodoInput';
    import Calendar from '../components/Calendar';
    import { addTodo, toggleTodo, deleteTodo, updateTodo, fetchTodos, filterTodosByDate, setSelectedDate } from '../redux/todoSlice';

    const Home = () => {
        const dispatch = useDispatch();
        const isLoaded = useSelector((state) => state.todos.isLoaded);
        const filteredTodos = useSelector((state) => state.todos.filteredTodos);
        const selectedDate = useSelector((state) => state.todos.selectedDate);
        const taskCount = filteredTodos.length;

        useEffect(() => {
            if (!isLoaded) {
              dispatch(fetchTodos());
            }
        
            const storedDate = localStorage.getItem('selectedDate');
            if (storedDate) {
              dispatch(setSelectedDate(storedDate));
            }
          }, [dispatch, isLoaded]);


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

        const handleDateChange = (date) => {
            const dateString = date.toISOString().split('T')[0];
            localStorage.setItem('selectedDate', dateString);
            dispatch(setSelectedDate(dateString));
        };
        return (
            <Layout>
                <Header taskCount={taskCount} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TodoInput onAdd={handleAddTodo} />
                        <h2 className="text-xl font-bold mb-4">All Tasks</h2>
                        <TaskList todos={filteredTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} onEdit={handleUpdateTodo} />
                    </div>
                    <div>
                        <Calendar onDateChange={handleDateChange} />
                    </div>
                </div>
            </Layout>
        );
    };

    export default Home;
