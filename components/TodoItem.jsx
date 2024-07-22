
import React, { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
    const { updateTodo, toggleTodo, deleteTodo } = useTodos();
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(todo.text);
    const [newAttachment, setNewAttachment] = useState(null);

    const handleUpdate = () => {
        updateTodo(todo.id, newText, newAttachment);
        setIsEditing(false);
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) => setNewAttachment(e.target.files[0])}
                    />
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, !todo.completed)}
                        className="toggle-button"
                    />
                    <span className="todo-text">{todo.text}</span>
                    {todo.attachment && (
                        <a href={todo.attachment} target="_blank" rel="noopener noreferrer">
                            View Attachment
                        </a>
                    )}
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => deleteTodo(todo.id, todo.attachment)}>Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TodoItem;

