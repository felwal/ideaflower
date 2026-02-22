export function resolvePromise(promise, promiseState, id, notifyACB) {
  if (!promise) return;

  promiseState.promise = promise;
  promiseState.id = id;
  promiseState.data = null;
  promiseState.error = null;

  if (notifyACB) notifyACB();

  function saveDataACB(result) {
    if (promiseState.promise !== promise) return;

    promiseState.data = result;
    if (notifyACB) notifyACB();
  }

  function saveErrorACB(err) {
    if (promiseState.promise !== promise) return;

    promiseState.error = err;
    if (notifyACB) notifyACB();
  }

  promise.then(saveDataACB).catch(saveErrorACB);
}

export function resolvePromiseMock(response, promiseState, id, notifyACB) {
  promiseState.promise = null;
  promiseState.id = id;
  promiseState.data = response;
  promiseState.error = null;

  if (notifyACB) notifyACB();
}

export function isPromiseLoading(promiseState) {
  return promiseState.promise && !promiseState.error && !promiseState.data;
}
