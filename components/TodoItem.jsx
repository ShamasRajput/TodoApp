// components/TodoItem.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, updateTodo } from '../redux/todoSlice';

const TodoItem = ({ todo }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newAttachment, setNewAttachment] = useState(null);

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

  return (
    <div className={`flex justify-between items-center p-4 bg-white rounded-lg shadow mb-4 ${todo.completed ? 'bg-white' : 'bg-gray-300'}`}>
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
              onChange={(e) => setNewAttachment(e.target.files[0])}
              className="p-2 border border-gray-300 rounded-r-lg"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={handleUpdate} className="p-2 bg-yellow-500 text-white rounded mr-2">Save</button>
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
            <button onClick={handleDelete} className="p-2 bg-red-800 text-white rounded">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
