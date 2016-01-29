import { createAction } from 'reflux';
import { login as userLogin } from '../api';

export const login = createAction();
export const loginCompleted = createAction();
export const loginFail = createAction();
export const logout = createAction();

// SIDE-EFFECT: xhr request is triggered on populationActions.load()
login.listen((user, pass) => {
  userLogin(user, pass)
    .then(loginCompleted)
    .catch(loginFail);
});

