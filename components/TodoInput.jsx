
import React, { useState, useRef } from 'react';

const TodoInput = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text, attachment);
            setText('');
            setAttachment(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                >
                    Choose File
                </button>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef} // Attach ref to file input
                />
                <button className="p-2 bg-yellow-500 text-white rounded-lg ml-2" type="submit">Add</button>
            </div>
            {attachment && <p className="text-sm text-gray-600">{attachment.name}</p>}
        </form>
    );
};

export default TodoInput;

