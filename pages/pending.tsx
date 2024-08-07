// pages/pending-tasks.tsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import Calendar from '../components/Calendar';
import { toggleTodo, deleteTodo } from '../redux/todoSlice';
import { RootState, AppDispatch } from '../redux/store';

const PendingTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredTodos = useSelector((state: RootState) => state.todos.filteredTodos);

  // Filter for pending todos
  const pendingTodos = filteredTodos.filter(todo => !todo.completed);
  const taskCount = pendingTodos.length;

  const handleToggleTodo = (id: string) => {
    const todo = filteredTodos.find(todo => todo.id === id);
    if (todo) {
      dispatch(toggleTodo({ id, completed: !todo.completed }));
    }
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo({ id }));
  };

  // No-op for onEdit if not used
  const handleEditTodo = (id: string, text: string, attachment?: File) => {};

  // No-op for onDateChange if not used in this context
  const handleDateChange = (date: Date) => {};

  return (
    <Layout>
      <Header taskCount={taskCount} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
          <TaskList
            todos={pendingTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        </div>
        <div>
          <Calendar onDateChange={handleDateChange}/>
        </div>
      </div>
    </Layout>
  );
};

export default PendingTasks;
