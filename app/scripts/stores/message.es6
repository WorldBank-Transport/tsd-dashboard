import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { clear, savePropertiesCompleted, savePropertiesFail } from '../actions/data';
import { saveUserFail, loadUsersFail} from '../actions/users';
import { logMessage } from '../actions/message';


const MessageStore = createStore({
  initialData: {},
  mixins: [SaneStore],
  init() {
    this.listenTo(clear, 'clear');
    this.listenTo(savePropertiesCompleted, 'loggedMessage');
    this.listenTo(savePropertiesFail, 'loggedMessage');
    this.listenTo(saveUserFail, 'loggedMessage');
    this.listenTo(loadUsersFail, 'loggedMessage');
    this.listenTo(logMessage, 'loggedMessage');
  },
  clear() {
    this.setData({});
  },
  loggedMessage(object) {
    this.setData({message: object});
  },
});

export default MessageStore;
