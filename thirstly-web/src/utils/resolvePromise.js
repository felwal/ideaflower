export default function resolvePromise(promise, promiseState, notifyAcb) {
  if (!promise) return;

  promiseState.promise = promise;
  promiseState.data = null;
  promiseState.error = null;

  if (notifyAcb) notifyAcb();

  function saveDataAcb(result) {
    if (promiseState.promise !== promise) return;

    promiseState.data = result;
    if (notifyAcb) notifyAcb();
  }

  function saveErrorAcb(err) {
    if (promiseState.promise !== promise) return;

    promiseState.error = err;
    if (notifyAcb) notifyAcb();
  }

  promise.then(saveDataAcb).catch(saveErrorAcb);
}

export function resolvePromiseMock(response, promiseState, notifyAcb) {
  promiseState.promise = null;
  promiseState.data = response;
  promiseState.error = null;

  if (notifyAcb) notifyAcb();
}
