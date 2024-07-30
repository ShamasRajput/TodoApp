// redux/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../lib/supabase';
import { gql } from '@apollo/client';
import client from '../lib/apolloClient';

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


export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    try {
      const { data } = await client.query({ query: FETCH_TODOS });
      console.log('Fetched Todos:', data.todosCollection.edges.map(edge => edge.node));

      return data.todosCollection.edges.map(edge => edge.node);
    } catch (error) {
      console.error('Failed to fetch todos:', error.message);
      throw error; 
    }
    
  });
  

export const addTodo = createAsyncThunk('todos/addTodo', async ({ text, attachment }) => {
    let attachmentUrl = null;

    if (attachment) {
        try {
            const fileName = `${Date.now()}_${encodeURIComponent(attachment.name)}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('todoapp')
                .upload(fileName, attachment, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                throw new Error('Error uploading attachment');
            }

            const { data, error: urlError } = supabase.storage
                .from('todoapp')
                .getPublicUrl(fileName);

            if (urlError) {
                throw new Error('Error getting public URL');
            }

            attachmentUrl = decodeURIComponent(data.publicUrl);
        } catch (error) {
            console.log('Attachment upload error:', error.message)
        }
    }

    try {
        const { data } = await client.mutate({
            mutation: ADD_TODO,
            variables: { text, attachment: attachmentUrl },
        });

        return data.insertIntotodosCollection.records[0];
    } catch (error) {
        console.log('Failed to Add todo:', error.message)
    }
});
export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, text, newAttachment }, { getState }) => {
    let newAttachmentUrl = null;

    const state = getState();
    const todos = state.todos.todos;
    const currentTodo = todos.find(todo => todo.id === id);
    const oldAttachmentUrl = currentTodo?.attachment;

    if (newAttachment) {
        const newFileName = `${Date.now()}_${encodeURIComponent(newAttachment.name)}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('todoapp')
            .upload(newFileName, newAttachment, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            throw new Error('Error uploading new attachment');
        }

        const { data, error: urlError } = supabase.storage
            .from('todoapp')
            .getPublicUrl(newFileName);

        if (urlError) {
            throw new Error('Error getting new public URL');
        }

        newAttachmentUrl = decodeURIComponent(data.publicUrl);

        if (oldAttachmentUrl) {
            const oldFileName = new URL(oldAttachmentUrl).pathname.split('/').pop();
            const { error: deleteError } = await supabase.storage
                .from('todoapp')
                .remove([decodeURIComponent(oldFileName)]);
            if (deleteError) {
                throw new Error('Error deleting old attachment');
            }
        }
    } else {
        newAttachmentUrl = oldAttachmentUrl;
    }

    const { data } = await client.mutate({
        mutation: UPDATE_TODO,
        variables: { id, text, attachment: newAttachmentUrl },
    });

    return data.updatetodosCollection.records[0];
});

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async ({ id, completed }) => {
    const { data } = await client.mutate({
        mutation: TOGGLE_TODO,
        variables: { id, completed },
    });

    return data.updatetodosCollection.records[0];
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async ({ id, attachment }) => {
    if (attachment) {
        const fileName = new URL(attachment).pathname.split('/').pop();
        const { error: deleteError } = await supabase.storage
            .from('todoapp')
            .remove([decodeURIComponent(fileName)]);
        if (deleteError) {
            throw new Error('Error deleting attachment');
        }
    }

    const { data } = await client.mutate({
        mutation: DELETE_TODO,
        variables: { id },
    });
    console.log('Todo deleted:', data.deleteFromtodosCollection.records[0]);

    return data.deleteFromtodosCollection.records[0];
});

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        loading: false,
        error: null,
        isLoaded: false,
    },
    reducers: {
      setTodosLoaded: (state, action) => {
        state.isLoaded = action.payload;
    },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = action.payload;
                console.log('Fetched Todos:', state.todos);
                state.isLoaded = true;

            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isLoaded = true;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
              state.todos.unshift(action.payload);
              // const updatedTodos = [...state.todos]
              // updatedTodos.unshift(action.payload)
              // state.todos = [...updatedTodos]
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(toggleTodo.fulfilled, (state, action) => {
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
            });
    },
});

export default todoSlice.reducer;
