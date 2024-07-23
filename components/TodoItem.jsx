

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
        <div className={`list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'list-group-item-success' : ''}`}>
            {isEditing ? (
                <div className="w-100">
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="form-control"
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewAttachment(e.target.files[0])}
                            className="form-control-file"
                        />
                    </div>
                    <div className="d-flex justify-content-end">
                        <button onClick={handleUpdate} className="btn btn-primary mr-2">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex align-items-center" style={{ flexGrow: 1 }}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id, !todo.completed)}
                            className="mr-2"
                        />
                        <span className="todo-text" style={{marginLeft: "10px", flexGrow: 1 }}>{todo.text}</span>
                    </div>
                    {todo.attachment && (
                        <div className="attachment-preview d-flex align-items-center">
                            <a href={todo.attachment} target="_blank" rel="noopener noreferrer">
                                <img src={todo.attachment} alt="attachment preview" className="img-thumbnail mr-2" style={{ width: '50px', height: '50px' }} />
                            </a>
                        </div>
                    )}
                    <div className="d-flex justify-content-end">
                        <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary btn-sm mr-2">Edit</button>
                        <button onClick={() => deleteTodo(todo.id, todo.attachment)} className="btn btn-outline-danger btn-sm">Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TodoItem;
