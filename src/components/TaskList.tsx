// components/TaskList.tsx

import React from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../../types'; 

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, attachment?: File) => void; // Add onEdit prop
}

const TaskList: React.FC<TaskListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  return (
    <div className='max-h-80 overflow-y-auto p-4 bg-white rounded-2xl shadow-lg scrollbar-thin'>
      {todos.length > 0 ? (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit} // Pass onEdit to TodoItem
          />
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default TaskList;
