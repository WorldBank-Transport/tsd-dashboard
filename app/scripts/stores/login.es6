import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loginCompleted, loginFail, logout } from '../actions/login';


const LoginStore = createStore({
  initialData: {logged: false},
  mixins: [SaneStore],
  init() {
    this.listenTo(loginCompleted, 'loginCompleted');
    this.listenTo(loginFail, 'loginFail');
    this.listenTo(logout, 'logout');
  },
  logout() {
    this.setData(this.initialData);
  },
  loginCompleted(object) {
    this.setData({
      logged: true,
      user: object.object,
    });
  },
  loginFail(err) {
    this.setData({
      err: err[1],
      logged: false,
    });
  },
});

export default LoginStore;
