import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadE, loadProgressE, loadCompletedE, loadFailedE } from '../actions/data';
import { getEducation } from '../api';

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

const EducationStore = createStore({
  initialData: DUMMY,
  mixins: [SaneStore],
  init() {
    this.listenTo(loadE, 'loadIfNeeded');
    this.listenTo(loadCompletedE, 'loadData');
  },
  loadIfNeeded() {
    if (this.get() === DUMMY) {
      this.getDataFromApi();
    } else {
      loadCompletedE(this.get());
    }
  },
  loadData(data) {
    this.setData(data);
  },

  getDataFromApi() {
    const proxier = getNextProxier();
    getEducation(proxier(loadProgressE))
      .then(proxier(loadCompletedE))
      .catch(proxier(loadFailedE));
  },
});


export default EducationStore;
