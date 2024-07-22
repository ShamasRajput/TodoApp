import React, { useState } from 'react';

const TodoInput = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);

    const handleAddTodo = () => {
        if (text.trim()) {
            onAdd(text, attachment);
            setText('');
            setAttachment(null);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new todo"
                    style={{ flex: 1 }}
                />
                <button onClick={handleAddTodo}>Add</button>
            </div>
            <input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                style={{ marginTop: '8px' }}
            />
        </div>
    );
};

export default TodoInput;
