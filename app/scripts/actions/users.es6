import { createAction } from 'reflux';
import { getUsers, postUser } from '../api';

export const loadUsers = createAction();
export const loadUsersCompleted = createAction();
export const loadUsersFail = createAction();
export const saveUser = createAction();
export const saveUserCompleted = createAction();
export const saveUserFail = createAction();

// SIDE-EFFECT: xhr request is triggered on populationActions.load()
loadUsers.listen((login) => {
  getUsers(login)
    .then(loadUsersCompleted)
    .catch(loadUsersFail);
});

// SIDE-EFFECT: xhr request is triggered on populationActions.load()
saveUser.listen((login, user) => {
  postUser(login, user)
    .then(saveUserCompleted)
    .catch(saveUserFail);
});
