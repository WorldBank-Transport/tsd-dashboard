import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadW, loadProgressW, loadCompletedW, loadFailedW } from '../actions/data';
import { getHealthFacilities, getEducation, getWaterStats } from '../api';

const DUMMY = [];

let CURRENT_REQUEST;

const getNextProxier = (type) => {
  CURRENT_REQUEST = {};  // reset to some unique ref
  const thisReq = CURRENT_REQUEST;  // re-bind in this scope
  return fn => (...rest) => {
    if (thisReq === CURRENT_REQUEST) {
      return fn(...rest, type);
    }  // else the request we had was no longer current, so do nothing.
  };
};

const DataStore = createStore({
  initialData: {
    education: DUMMY,
    water: DUMMY,
    health: DUMMY,
  },
  mixins: [SaneStore],
  init() {
    this.listenTo(loadW, 'loadIfNeeded');
    this.listenTo(loadCompletedW, 'loadData');
  },
  loadIfNeeded(type) {
    if (this.get()[type] === DUMMY) {
      this.getDataFromApi(type);
    } else {
      loadCompleted(this.get()[type], type);
    }
  },
  loadData(data, type) {
    debugger;
    const tmp = {
      ...this.get(),
      [type]: data,
    };
    this.setData(tmp);
  },
  getData(type) {
    return this.get()[type];
  },

  getDataFromApi(type) {
    debugger;
    const proxier = getNextProxier(type);
    let apiFn;
    switch (type) {
    case 'education': 
      apiFn = getEducation;
      break;
    case 'water': 
      apiFn = getWaterStats;
      break;
    case 'health': 
      apiFn = getHealthFacilities;
      break;
    }
    apiFn(proxier(loadProgressW))
      .then(proxier(loadCompletedW))
      .catch(proxier(loadFailedW));
  },
});


export default DataStore;
