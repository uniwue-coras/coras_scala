import {Action, createStore} from 'redux';
import {ILoginResult} from './myTsModels';

const userField = 'user';

// User login

export const USER_LOGIN = 'USER_LOGIN';

interface UserLoginAction extends Action<typeof USER_LOGIN> {
  user: ILoginResult;
}

export function userLoginAction(user: ILoginResult): UserLoginAction {
  return {type: USER_LOGIN, user};
}

// User logout

export const USER_LOGOUT = 'USER_LOGOUT';

type UserLogoutAction = Action<typeof USER_LOGOUT>;

export const userLogoutAction: UserLogoutAction = {type: USER_LOGOUT};

// Actions

export type StoreAction = UserLoginAction | UserLogoutAction;

interface StoreState {
  currentUser?: ILoginResult;
}

function rootReducer(store: StoreState = {}, action: StoreAction): StoreState {
  switch (action.type) {
    case USER_LOGIN:
      localStorage.setItem(userField, JSON.stringify(action.user));
      return {...store, currentUser: action.user};
    case USER_LOGOUT:
      localStorage.removeItem(userField);
      return {...store, currentUser: undefined};

    default:
      return store;
  }
}

function initialState(): StoreState {
  const currentUserString = localStorage.getItem(userField);

  return {
    currentUser: currentUserString ? JSON.parse(currentUserString) : undefined
  };
}

export const store = createStore(rootReducer, initialState());

export const currentUserSelector: (store: StoreState) => ILoginResult | undefined = (store) => store.currentUser;

// export const currentUserIsAdminSelector: (store: StoreState) => boolean = (store) => !!store.currentUser?.hasAdminRights;
