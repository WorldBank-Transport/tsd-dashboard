import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadW, loadProgressW, loadCompletedW, loadFailedW } from '../actions/data';
import { getWaterStats } from '../api';

const DUMMY = [];

let CURRENT_REQUEST;

const getNextProxier = () => {
  CURRENT_REQUEST = {};  // reset to some unique ref
  const thisReq = CURRENT_REQUEST;  // re-bind in this scope
  return fn => (...rest) => {
    if (thisReq === CURRENT_REQUEST) {
      return fn(...rest);
    }  // else the request we had was no longer current, so do nothing.
  };
};

const WaterStore = createStore({
  initialData: DUMMY,
  mixins: [SaneStore],
  init() {
    this.listenTo(loadW, 'loadIfNeeded');
    this.listenTo(loadCompletedW, 'loadData');
  },
  loadIfNeeded() {
    if (this.get() === DUMMY) {
      this.getDataFromApi();
    } else {
      loadCompletedW(this.get());
    }
  },

  loadData(data) {
    this.setData(data);
  },

  getDataFromApi() {
    const proxier = getNextProxier();
    getWaterStats(proxier(loadProgressW))
      .then(proxier(loadCompletedW))
      .catch(proxier(loadFailedW));
  },
});


export default WaterStore;
