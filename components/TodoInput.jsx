import React, { useState, useRef } from 'react';

const TodoInput = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);


    const handleAddTodo = () => {
        if (text.trim()) {
            onAdd(text, attachment);
            setText('');
            setAttachment(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    };

    return (    
        <div className='mb-4'>
            <div className='input-group mb-3'>
                <input
                    type="text"
                    className='form-control'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new todo"
                    style={{ flex: 1 }}
                />
                <button  className="btn btn-primary" onClick={handleAddTodo}>Add</button>
            </div>
            <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                className='form-control-file'
                ref={fileInputRef}
            />
        </div>
    );
};

export default TodoInput;
