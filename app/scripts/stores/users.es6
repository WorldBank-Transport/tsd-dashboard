import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { saveUserCompleted, loadUsersCompleted } from '../actions/users';


const UsersStore = createStore({
  initialData: [],
  mixins: [SaneStore],
  init() {
    this.listenTo(loadUsersCompleted, 'load');
    this.listenTo(saveUserCompleted, 'saveUser');
  },
  load(resp) {
    this.setData(resp.object);
  },
  saveUser(resp) {
    const user = resp.object;
    let users = this.get();
    const found = users.find(u => u._id === user._id);
    if (found) {
      users = users.map(u => u._id === user._id ? user : u);
    } else {
      users.push(user);
    }
    this.setData(users);
  },
});

export default UsersStore;
