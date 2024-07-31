
// import React, { useEffect,useState, useRef } from 'react';
// import { useSelector } from 'react-redux';


// const TodoInput = ({ onAdd }) => {
//     const [text, setText] = useState('');
//     const [attachment, setAttachment] = useState(null);
//     const [error, setError] = useState('');
//     const fileInputRef = useRef(null);
//     const todos = useSelector((state) => state.todos.todos);


//     useEffect(() => {
//         if (error && !todos.some((todo) => todo.text === text.trim())) {
//             setError('');
//         }
//     }, [text, todos, error]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (text.trim()) {
//             // Check for duplicate
//             const isDuplicate = todos.some((todo) => todo.text === text.trim());
//             if (isDuplicate) {
//                 setError('Todo item already exists.');
//                 return;
//             }
//             onAdd(text, attachment);
//             setText('');
//             setAttachment(null);
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = ''; // Reset file input
//             }
//         }
//     };

//     const handleFileChange = (e) => {
//         setAttachment(e.target.files[0]);
//     };

//     const triggerFileInput = () => {
//         fileInputRef.current.click();
//     };

//     return (
//         <form onSubmit={handleSubmit} className="mb-4">
//             <div className="flex items-center mb-3">
//                 <input
//                     type="text"
//                     className="flex-1 p-2 border border-gray-300 rounded-l-lg"
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     placeholder="Add a new task"
//                 />
//                 <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="p-2 bg-black text-white rounded-lg ml-2"
//                 >
//                     Choose File
//                 </button>
//                 <input
//                     type="file"
//                     className="hidden"
//                     onChange={handleFileChange}
//                     ref={fileInputRef} // Attach ref to file input
//                 />
//                 <button className="p-2 bg-yellow-500 text-white rounded-lg ml-2" type="submit">Add</button>
//             </div>
//             {attachment && <p className="text-sm text-gray-600">{attachment.name}</p>}
//             {error && <p className="text-red-500">{error}</p>}
//         </form>
//     );
// };

// export default TodoInput;

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const TodoInput = ({ onAdd }) => {
    const [text, setText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Retrieve selected date and todos from Redux state
    const selectedDate = useSelector((state) => state.todos.selectedDate);
    const todos = useSelector((state) => state.todos.todos);

    // Filter todos by the selected date
    const todosForSelectedDate = selectedDate 
        ? todos.filter(todo => new Date(todo.created_at).toISOString().split('T')[0] === selectedDate)
        : todos;

    useEffect(() => {
        if (error && !todosForSelectedDate.some((todo) => todo.text === text.trim())) {
            setError('');
        }
    }, [text, todosForSelectedDate, error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            // Check for duplicate on the selected date
            const isDuplicate = todosForSelectedDate.some((todo) => todo.text === text.trim());
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
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default TodoInput;
