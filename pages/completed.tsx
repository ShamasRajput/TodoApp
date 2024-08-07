// pages/completed-tasks.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';
import { toggleTodo, deleteTodo } from '../redux/todoSlice';
import { RootState, AppDispatch } from '../redux/store';

const CompletedTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredTodos = useSelector((state: RootState) => state.todos.filteredTodos);

  const completedTodos = filteredTodos.filter(todo => todo.completed);
  const taskCount = completedTodos.length;

  const handleToggleTodo = (id: string) => {
    const todo = filteredTodos.find(todo => todo.id === id);
    if (todo) {
      dispatch(toggleTodo({ id, completed: !todo.completed }));
    }
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo({ id }));
  };

  return (
    <Layout>
      <Header taskCount={taskCount} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
          <TaskList todos={completedTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
        </div>
        <div>
          <Calendar />
        </div>
      </div>
    </Layout>
  );
};

export default CompletedTasks;
