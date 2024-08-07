// redux/todoSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import supabase from '../lib/supabase';
import client from '../lib/apolloClient';
import { gql } from '@apollo/client';
import  {RootState}  from './store';
import  {Todo} from '../types'

// Define the GraphQL queries and mutations
const FETCH_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      completed
      attachment
      createdAt
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!, $attachment: String) {
    addTodo(text: $text, attachment: $attachment) {
      id
      text
      completed
      attachment
      createdAt
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $text: String, $completed: Boolean, $attachment: String) {
    updateTodo(id: $id, text: $text, completed: $completed, attachment: $attachment) {
      id
      text
      completed
      attachment
      createdAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

// Define the initial state type
interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
}

// Initial state
const initialState: TodoState = {
  todos: [],
  filteredTodos: [],
  selectedDate: null,
  loading: false,
  error: null,
  isLoaded: false,
};

// Define async thunks
export const fetchTodos = createAsyncThunk<Todo[]>('todos/fetchTodos', async () => {
  const { data } = await client.query({ query: FETCH_TODOS });
  return data.todos;
});

export const addTodo = createAsyncThunk<Todo, { text: string; attachment?: File }>(
  'todos/addTodo',
  async ({ text, attachment }) => {
    let attachmentUrl: string | null = null;

    if (attachment) {
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

      const { data } = supabase.storage
        .from('todoapp')
        .getPublicUrl(fileName);

      if (!data) {
        throw new Error('Error getting public URL');
      }

      attachmentUrl = decodeURIComponent(data.publicUrl);
    }

    const { data } = await client.mutate({
      mutation: ADD_TODO,
      variables: { text, attachment: attachmentUrl },
    });

    return data.addTodo;
  }
);

export const updateTodo = createAsyncThunk<Todo | null, { id: string; text?: string; newAttachment?: File }, { state: RootState }>(
  'todos/updateTodo',
  async ({ id, text, newAttachment }, { getState }) => {
    let newAttachmentUrl: string | null = null;

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

      const { data } = supabase.storage
        .from('todoapp')
        .getPublicUrl(newFileName);

      if (!data) {
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

    return data.updateTodo;
  }
);

export const toggleTodo = createAsyncThunk<Todo | null, { id: string; completed: boolean }>(
  'todos/toggleTodo',
  async ({ id, completed }) => {
    const { data } = await client.mutate({
      mutation: UPDATE_TODO,
      variables: { id, completed },
    });

    return data.updateTodo;
  }
);

export const deleteTodo = createAsyncThunk<{ id: string }, { id: string; attachment?: string }>(
  'todos/deleteTodo',
  async ({ id, attachment }) => {
    if (attachment) {
      const fileName = new URL(attachment).pathname.split('/').pop();
      const { error: deleteError } = await supabase.storage
        .from('todoapp')
        .remove([decodeURIComponent(fileName)]);
      if (deleteError) {
        throw new Error('Error deleting attachment');
      }
    }

    await client.mutate({
      mutation: DELETE_TODO,
      variables: { id },
    });

    return { id };
  }
);

// Define the slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodosLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    filterTodosByDate: (state, action: PayloadAction<string | null>) => {
      const selectedDate = action.payload;
      if (selectedDate) {
        state.filteredTodos = state.todos.filter(todo => {
          const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
          return todoDate === selectedDate;
        });
      } else {
        state.filteredTodos = state.todos;
      }
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
      state.filteredTodos = state.todos.filter(todo => {
        const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
        return action.payload ? todoDate === action.payload : true;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
        state.isLoaded = true;
        if (state.selectedDate) {
          state.filteredTodos = action.payload.filter(todo => {
            const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
            return todoDate === state.selectedDate;
          });
        } else {
          state.filteredTodos = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
        state.isLoaded = true;
      })
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        state.todos.unshift(action.payload);
        const todoDate = new Date(parseInt(action.payload.createdAt, 10)).toISOString().split('T')[0];
        if (!state.selectedDate || todoDate === state.selectedDate) {
          state.filteredTodos.unshift(action.payload);
        }
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add todo';
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo | null>) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload?.id);
        if (index !== -1 && action.payload) {
          state.todos[index] = action.payload;
        }
        state.filteredTodos = state.todos.filter(todo => {
          const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
          return state.selectedDate ? todoDate === state.selectedDate : true;
        });
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update todo';
      })
      .addCase(toggleTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo | null>) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload?.id);
        if (index !== -1 && action.payload) {
          state.todos[index] = action.payload;
        }
        state.filteredTodos = state.todos.filter(todo => {
          const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
          return state.selectedDate ? todoDate === state.selectedDate : true;
        });
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle todo';
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        state.filteredTodos = state.todos.filter(todo => {
          const todoDate = new Date(parseInt(todo.createdAt, 10)).toISOString().split('T')[0];
          return state.selectedDate ? todoDate === state.selectedDate : true;
        });
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete todo';
      });
  },
});

export const { filterTodosByDate, setSelectedDate } = todoSlice.actions;
export default todoSlice.reducer;
