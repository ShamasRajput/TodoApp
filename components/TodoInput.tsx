// components/TodoInput.tsx

import React, { useEffect, useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Todo } from '../types'; 

interface TodoInputProps {
  onAdd: (text: string, attachment: File | null) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState<string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const loading = useSelector((state: RootState) => state.todos.loading);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Retrieve selected date and todos from Redux state
  const selectedDate = useSelector((state: RootState) => state.todos.selectedDate);
  const todos = useSelector((state: RootState) => state.todos.todos);

  // Filter todos by the selected date
  const todosForSelectedDate = selectedDate
    ? todos.filter((todo: Todo) => {
        if (!todo.createdAt) {
          console.error('Missing created_at for todo:', todo);
          return false;
        }
        try {
          const todoDate = new Date(todo.createdAt).toISOString().split('T')[0];
          return todoDate === selectedDate;
        } catch (error) {
          console.error('Invalid created_at value:', todo.createdAt, error);
          return false;
        }
      })
    : todos;

  useEffect(() => {
    if (error && !todosForSelectedDate.some((todo) => todo.text.toLowerCase().trim() === text.toLowerCase().trim())) {
      setError('');
    }
  }, [text, todosForSelectedDate, error]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      // Check for duplicate on the selected date
      const isDuplicate = todosForSelectedDate.some(
        (todo) => todo.text.toLowerCase().trim() === text.toLowerCase().trim()
      );
      if (isDuplicate) {
        setError('Todo item already exists.');
        return;
      }
      onAdd(text, attachment);
      setText('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    } else {
      setError('Todo text cannot be empty.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachment(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex items-center mb-3">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className="p-2 bg-black text-white rounded-lg ml-2"
          disabled={loading}
        >
          Choose File
        </button>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef} // Attach ref to file input
        />
        <button className="p-2 bg-yellow-500 text-white rounded-lg ml-2" type="submit" disabled={loading}>
          Add
        </button>
      </div>
      {attachment && <p className="text-sm text-gray-600">{attachment.name}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default TodoInput;
