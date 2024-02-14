import {Rights} from './graphql';
import {configureStore, createSlice, EnhancedStore, PayloadAction} from '@reduxjs/toolkit';

function loadJsonFromLocalStorage<T>(key: string, defaultValue: T): T {
  const readValue = localStorage.getItem(key);

  return readValue ? JSON.parse(readValue) : defaultValue;
}

// User slice

const userField = 'user';

export interface User {
  username: string;
  rights: Rights;
  token: string;
}

function userFromToken(token: string): Omit<User, 'token'> {
  return JSON.parse(
    atob(
      token.split('.')[1]
        .replaceAll(/-/g, '+')
        .replaceAll(/_/g, '/')
    )
  );
}

const userSlice = createSlice({
  name: 'user',
  initialState: (): { user: User | null } => {
    return {user: loadJsonFromLocalStorage(userField, null)};
  },
  reducers: {
    login(state, {payload}: PayloadAction<string>) {
      const user = {...userFromToken(payload), token: payload};
      localStorage.setItem(userField, JSON.stringify(user));
      state.user = user;
    },
    logout(state) {
      localStorage.removeItem(userField);
      state.user = null;
    }
  }
});

export const {login, logout} = userSlice.actions;

export const currentUserSelector: (store: StoreState) => User | null = ({user}) => user.user;

// Store

interface StoreState {
  user: { user: User | null };
}

export const store: EnhancedStore<StoreState> = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});
