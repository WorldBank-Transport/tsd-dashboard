/* eslint camelcase: 0 */  // snake_case query params are not set by us
import isUndefined from 'lodash/lang/isUndefined';
import { Ok, Err } from 'results';
import * as func from '../functional';
import warn from '../warn';
import { fetchAndCheck } from './http';


const converters = {
  text: t => t,
  numeric: n => parseFloat(n),
  int4: n => parseInt(n, 10),
  int8: n => parseInt(n, 10),
};

/**
 * @param {object} ckanObj The object returned by CKAN
 * @returns {Promise<object>} resolves the object, or rejects if it's an error
 */
export function rejectIfNotSuccess(ckanObj) {
  if (!ckanObj.success) {
    warn(ckanObj);
    return Promise.reject(['error.api.ckan']);
  } else {  // pass-through
    return Promise.resolve(ckanObj);
  }
}

/**
 * @param {string} id The field name
 * @param {string} type The field type, must match something in converters
 * @returns {Result} an (id, converter) pair for converting a record key to its type
 */
export function convertField({id, type} = {}) {
  if (!isUndefined(converters[type])) {
    return Ok({[id]: converters[type]});
  } else {
    warn(`Unknown data type for conversion: '${type}', specified for field ${id}`);
    return Err(['error.api.ckan.unknown-field-type', type, id]);
  }
}

/**
 * @param {object} fieldConverters A key:func mapping of field names to converter functions
 * @param {object} record The key:rawValue record to be converted
 * @returns {Result} the record but with converted values
 */
export function convertRecord(fieldConverters, record) {
  /*
  Original, slow version:

    function convertRecord(fieldConverters, record) {
      return func.Result.mapMergeObj(([id, converter]) => {
        if (!isUndefined(record[id])) {
          return Ok({[id]: converter(record[id])});
        } else {
          warn(`Record is missing field '${id}': ${JSON.stringify(record)}`);
          return Err(['error.api.ckan.record-missing-field', id]);
        }
      }, fieldConverters);
    }

  The above function ate over 2s of CPU time for waterpoints on my machine, so
  here is a faster implementation:
  */
  const converted = {};
  for (const k in fieldConverters) {
    if (fieldConverters.hasOwnProperty(k)) {
      if (typeof record[k] !== 'undefined') {
        converted[k] = fieldConverters[k](record[k]);
      } else {
        warn(`Record is missing field '${k}': ${JSON.stringify(record)}`);
        return Err(['error.api.ckan.record-missing-field', k]);
      }
    }
  }
  return Ok(converted);
}

/**
 * @param {object} result The CKAN raw result
 * @param {object} result.result The actual CKAN data
 * @param {array} result.result.fields The data type descriptions
 * @param {array} result.result.records The raw data records as strings
 * @returns {Result<array>} The converted data
 */
export function convertCkanResp(result) {
  const {result: {fields, records}} = result;
  return func.Result
    .map(convertField, fields)
    .andThen(func.Result.merge)
    .andThen(fieldConverters =>
      func.Result.map(rec => convertRecord(fieldConverters, rec), records));
}

const convertChunk = data => convertCkanResp(data).promise();

/**
 * @param {func} postprocess A callback to process incoming data
 * @param {func} notify A callback to provide partial data updates
 * @param {array<Promise>} promises The promises to wait for
 * @returns {Promise} Resolves all the resolved data concatenated in one big
 * array, or rejects if any the promises fail.
 */
const promiseConcat = (postprocess, notify, ...promises) => new Promise((resolve, reject) => {
  let combined = Ok([]);
  promises.forEach(prom => prom
    .then(newData => {
      if (combined.isOk()) {
        try {  // in case postprocess throws
          combined = Ok(combined.unwrap().concat(postprocess(newData)));
          notify(combined.unwrap());
        } catch (err) {
          combined = Err(['error.api.postprocess']);
        }
      }
    })
    .catch(err => {
      combined = Err(err);
    }));
  Promise.all(promises)
    .then(() => resolve(combined.unwrap()))
    .catch(reject);
});

/**
 * @param {string} root The CKAN API root
 * @param {string} query Any query to be applied
 * @param {func} notify A callback to indicate progress
 * @param {func} postprocess A callback to run on the incoming data
 * @returns {Promise<array<object>>} The converted data
 */
function get(root, query, notify = () => null, postprocess = v => v) {
  const getData = () => {
    return fetchAndCheck(root + query)
      .then(resp => resp.json())
      .then(rejectIfNotSuccess);
  };

  const parse = (firstResp) => {
    const first = convertChunk(firstResp);
    return promiseConcat(postprocess, notify, first);
  };

  return getData().then(parse);
}


export default { get };
