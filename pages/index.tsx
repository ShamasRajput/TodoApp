// pages/index.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TodoInput from '../components/TodoInput';
import Calendar from '../components/Calendar';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  fetchTodos,
  setSelectedDate,
} from '../redux/todoSlice';
import { RootState, AppDispatch } from '../redux/store';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoaded = useSelector((state: RootState) => state.todos.isLoaded);
  const filteredTodos = useSelector((state: RootState) => state.todos.filteredTodos);
  const selectedDate = useSelector((state: RootState) => state.todos.selectedDate);
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

  const handleAddTodo = (text: string, attachment?: File) => {
    dispatch(addTodo({ text, attachment }));
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo({ id, completed: !filteredTodos.find(todo => todo.id === id)?.completed }));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo({ id }));
  };

  const handleUpdateTodo = (id: string, text: string, attachment?: File) => {
    dispatch(updateTodo({ id, text, newAttachment: attachment }));
  };

  const handleDateChange = (date: Date) => {
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
          <TaskList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleUpdateTodo}
          />
        </div>
        <div>
          <Calendar onDateChange={handleDateChange} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
