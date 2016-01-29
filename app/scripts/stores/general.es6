import { createStore } from 'reflux';
import SaneStore from '../utils/sane-store-mixin';
import { loadG } from '../actions/data';
import { getProperty } from '../api';

const DUMMY = {};

const GeneralStore = createStore({
  initialData: DUMMY,
  mixins: [SaneStore],
  init() {
    this.listenTo(loadG, 'loadIfNeeded');
  },
  loadIfNeeded() {
    if (this.get() === DUMMY) {
      this.getDataFromApi();
    }
  },

  addProperty(property) {
    this.setData({
      ...this.get(),
      [property.object.p]: property.object.v,
    });
  },

  getDataFromApi() {
    getProperty('ckan.url').then(this.addProperty);
    getProperty('ckan.base-url').then(this.addProperty);
  },
});

export default GeneralStore;
