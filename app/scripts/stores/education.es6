import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadE, loadProgressE, loadCompletedE, loadFailedE } from '../actions/data';
import { getEducation, getProperty } from '../api';

const DUMMY = {};

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
    this.setData({
      ...this.get(),
      ckan: data[0],
    });
  },
  
  addProperty(property) {
    this.setData({
      ...this.get(),
      [property.object.p]: property.object.v,
    });
  },

  getDataFromApi() {
    getProperty('edudash.homepage.year').then(this.addProperty);
    getProperty('edudash.homepage.target').then(this.addProperty);
    getProperty('edudash.homepage.query').then(property => {
      this.addProperty(property);
      const proxier = getNextProxier();
      getEducation(property.object.v, proxier(loadProgressE))
        .then(proxier(loadCompletedE))
        .catch(proxier(loadFailedE));
    });
  },
});

export default EducationStore;
