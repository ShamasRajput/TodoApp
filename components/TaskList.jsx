import React from 'react';
import TodoItem from './TodoItem';

const TaskList = ({ todos, onToggle, onDelete }) => {
    return (
        <div className='max-h-80 overflow-y-auto p-4 bg-white rounded-2xl shadow-lg scrollbar-thin'>
            {todos.length > 0 ? (
                todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </div>
    );
};

export default TaskList;