import { createAction } from 'reflux';
import { getProperty, postProperties } from '../api';

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
export const loadG = createAction();

export const saveProperties = createAction();
export const savePropertiesCompleted = createAction();
export const savePropertiesFail = createAction();
export const clear = createAction();

loadUrl.listen(() => {
  getProperty('ckan.url').then(property => {
    loadE(property.object.v);
    loadW(property.object.v);
    loadH(property.object.v);
  }).catch(err => {
    loadFailedE(err);
    loadFailedH(err);
    loadFailedW(err);
  });
});

saveProperties.listen((user, properties) =>
  postProperties(user, properties)
    .then(savePropertiesCompleted('saved.properties.successs'))
    .catch(err => savePropertiesFail(err[1]))
);
