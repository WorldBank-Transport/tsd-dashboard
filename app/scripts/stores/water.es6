import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadW, loadProgressW, loadCompletedW, loadFailedW } from '../actions/data';
import { getWaterStats, getProperty } from '../api';

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
    getProperty('waterdash.homepage.year').then(this.addProperty);
    getProperty('waterdash.homepage.target').then(this.addProperty);
    getProperty('waterdash.homepage.query').then(property => {
      this.addProperty(property);
      const proxier = getNextProxier();
      getWaterStats(property.object.v, proxier(loadProgressW))
        .then(proxier(loadCompletedW))
        .catch(proxier(loadFailedW));
    });
  },
});


export default WaterStore;
