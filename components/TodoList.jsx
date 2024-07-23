import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggle, onDelete }) => {
    if (!todos || !Array.isArray(todos)) {
        console.error('TodoList received invalid todos:', todos);
        return null;
    }

    return (
        <div className='list-group'>
            {todos.map((todo, index) => {
                if (!todo || !todo.id) {
                    console.error('Invalid todo at index:', index, todo);
                    return null;
                }
                return (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    );
};

export default TodoList;
