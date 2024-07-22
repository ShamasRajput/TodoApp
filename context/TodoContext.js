
import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import supabase from '../lib/supabase';

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

const FETCH_TODOS = gql`
  query GetTodos {
    todosCollection(orderBy: { created_at: DescNullsLast }) {
      edges {
        node {
          id
          text
          completed
          attachment
          created_at
        }
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!, $attachment: String) {
    insertIntotodosCollection(objects: { text: $text, attachment: $attachment }) {
      records {
        id
        text
        completed
        attachment
        created_at
      }
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $text: String!, $attachment: String) {
    updatetodosCollection(filter: { id: { eq: $id } }, set: { text: $text, attachment: $attachment }) {
      records {
        id
        text
        completed
        attachment
        created_at
      }
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: Int!, $completed: Boolean!) {
    updatetodosCollection(filter: { id: { eq: $id } }, set: { completed: $completed }) {
      records {
        id
        text
        completed
        attachment
        created_at
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteFromtodosCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

export const TodoProvider = ({ children }) => {
  const { data, loading, error, refetch } = useQuery(FETCH_TODOS);
  const [addTodoMutation] = useMutation(ADD_TODO);
  const [updateTodoMutation] = useMutation(UPDATE_TODO);
  const [toggleTodoMutation] = useMutation(TOGGLE_TODO);
  const [deleteTodoMutation] = useMutation(DELETE_TODO);

  const todos = data ? data.todosCollection.edges.map(edge => edge.node) : [];

  const addTodo = async (text, attachment) => {
    let attachmentUrl = null;

    if (attachment) {
      const fileName = `${Date.now()}_${encodeURIComponent(attachment.name)}`;
      console.log('Uploading file:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('todoapp')
        .upload(fileName, attachment, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading attachment:', uploadError);
        return;
      } else {
        console.log('File uploaded:', uploadData);
        const { data, error: urlError } = supabase.storage
          .from('todoapp')
          .getPublicUrl(fileName);

        if (urlError) {
          console.error('Error getting public URL:', urlError);
        } else {
          attachmentUrl = decodeURIComponent(data.publicUrl);
          console.log('Attachment URL:', attachmentUrl);
        }
      }
    }

    const { data, error } = await addTodoMutation({
      variables: { text, attachment: attachmentUrl },
      refetchQueries: [{ query: FETCH_TODOS }]
    });
    if (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, text, newAttachment) => {
    let newAttachmentUrl = null;

    // Retrieve the current todo item to get the old attachment URL
    const currentTodo = todos.find(todo => todo.id === id);
    const oldAttachmentUrl = currentTodo?.attachment;

    // Upload the new attachment if provided
    if (newAttachment) {
        const newFileName = `${Date.now()}_${encodeURIComponent(newAttachment.name)}`;
        console.log('Uploading new file:', newFileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('todoapp')
            .upload(newFileName, newAttachment, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading new attachment:', uploadError);
            return;
        } else {
            console.log('New file uploaded:', uploadData);
            const { data, error: urlError } = supabase.storage
                .from('todoapp')
                .getPublicUrl(newFileName);

            if (urlError) {
                console.error('Error getting new public URL:', urlError);
            } else {
                newAttachmentUrl = decodeURIComponent(data.publicUrl);
                console.log('New Attachment URL:', newAttachmentUrl);
            }

            // Delete the old attachment if a new one is successfully uploaded
            if (oldAttachmentUrl) {
                const oldFileName = new URL(oldAttachmentUrl).pathname.split('/').pop();
                const { error: deleteError } = await supabase.storage
                    .from('todoapp')
                    .remove([decodeURIComponent(oldFileName)]);
                if (deleteError) {
                    console.error('Error deleting old attachment:', deleteError);
                }
            }
        }
    } else {
        // If no new attachment is provided, retain the old attachment URL
        newAttachmentUrl = oldAttachmentUrl;
    }

    // Update the todo item with the new text and new attachment URL if provided
    const { data, error } = await updateTodoMutation({
        variables: { id, text, attachment: newAttachmentUrl },
        refetchQueries: [{ query: FETCH_TODOS }]
    });
    if (error) {
        console.error('Error updating todo:', error);
    }
};


  const toggleTodo = async (id, completed) => {
    const { data, error } = await toggleTodoMutation({
      variables: { id, completed },
      refetchQueries: [{ query: FETCH_TODOS }]
    });
    if (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id, attachment) => {
    if (attachment) {
      const fileName = new URL(attachment).pathname.split('/').pop();
      const { error: deleteError } = await supabase.storage
        .from('todoapp')
        .remove([decodeURIComponent(fileName)]);
      if (deleteError) {
        console.error('Error deleting attachment:', deleteError);
      }
    }
    const { data, error } = await deleteTodoMutation({
      variables: { id },
      refetchQueries: [{ query: FETCH_TODOS }]
    });
    if (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, toggleTodo, deleteTodo, loading, error }}>
      {children}
    </TodoContext.Provider>
  );
};
