import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadH, loadProgressH, loadCompletedH, loadFailedH } from '../actions/data';
import { getHealthFacilities } from '../api';

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

const HealthStore = createStore({
  initialData: DUMMY,
  mixins: [SaneStore],
  init() {
    this.listenTo(loadH, 'loadIfNeeded');
    this.listenTo(loadCompletedH, 'loadData');
  },
  loadIfNeeded() {
    if (this.get() === DUMMY) {
      this.getDataFromApi();
    } else {
      loadCompletedH(this.get());
    }
  },
  loadData(data) {
    this.setData(data);
  },

  getDataFromApi() {
    const proxier = getNextProxier();
    getHealthFacilities(proxier(loadProgressH))
      .then(proxier(loadCompletedH))
      .catch(proxier(loadFailedH));
  },
});


export default HealthStore;
