import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { clear, savePropertiesCompleted, savePropertiesFail } from '../actions/data';


const MessageStore = createStore({
  initialData: {},
  mixins: [SaneStore],
  init() {
    this.listenTo(clear, 'clear');
    this.listenTo(savePropertiesCompleted, 'loggedMessage');
    this.listenTo(savePropertiesFail, 'loggedMessage');
  },
  clear() {
    this.setData({});
  },
  loggedMessage(object) {
    this.setData({message: object});
  },
});

export default MessageStore;
