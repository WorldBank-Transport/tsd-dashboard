import { createAction } from 'reflux';
import { getProperty } from '../api';

export const loadE = createAction();
export const loadProgressE = createAction();
export const loadCompletedE = createAction();
export const loadFailedE = createAction();

export const loadW = createAction();
export const loadProgressW = createAction();
export const loadCompletedW = createAction();
export const loadFailedW = createAction();

export const loadH = createAction();
export const loadProgressH = createAction();
export const loadCompletedH = createAction();
export const loadFailedH = createAction();

export const loadUrl = createAction();

// SIDE-EFFECT: xhr request is triggered on populationActions.load()
loadUrl.listen(() => {
  debugger;
  getProperty('ckan.url').then(property => {
    debugger
    loadE(property.object.v);
    loadW(property.object.v);
    loadH(property.object.v);
  }).catch(err => {
    debugger;
    loadFailedE();
    loadFailedH();
    loadFailedW();
  });
});
