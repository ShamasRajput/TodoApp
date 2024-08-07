// components/TodoItem.tsx

import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTodo, deleteTodo, updateTodo } from '../redux/todoSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Todo } from '../types'; 

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(todo.text);
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const loading = useSelector((state: RootState) => state.todos.loading);

  const handleUpdate = async () => {
    try {
      await dispatch(updateTodo({ id: todo.id, text: newText, newAttachment })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTodo({ id: todo.id, attachment: todo.attachment })).unwrap();
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachment(e.target.files[0]);
    }
  };

  return (
    <div className={`flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4 ${todo.completed ? 'bg-green' : 'bg-white'}`}>
      {isEditing ? (
        <div className="w-full">
          <div className="flex mb-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg"
            />
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="p-2 border border-gray-300 rounded-r-lg"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleUpdate} className="p-2 bg-yellow-500 text-white rounded mr-2" disabled={loading}>Save</button>
            <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center flex-grow">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo({ id: todo.id, completed: !todo.completed }))}
              className="mr-2 h-6 w-6 rounded-full focus:ring-2 focus:ring-blue-500"
            />
            <span className={`flex-grow ml-2 ${todo.completed ? 'line-through' : ''}`}>
              {todo.text}
            </span>
          </div>
          {todo.attachment && (
            <a href={todo.attachment} target="_blank" rel="noopener noreferrer" className="mr-2">
              <img src={todo.attachment} alt="attachment preview" className="w-12 h-12 object-cover rounded" />
            </a>
          )}
          <div className="flex items-center">
            <button onClick={() => setIsEditing(true)} className="p-2 bg-yellow-500 text-white rounded mr-2">Edit</button>
            <button onClick={handleDelete} className="p-2 bg-red-800 text-white rounded" disabled={loading}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
