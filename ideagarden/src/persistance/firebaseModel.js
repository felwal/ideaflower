import { getDatabase, ref, set, onChildAdded, onChildRemoved, get, child, onValue, onChildChanged } from "firebase/database";
import { watch } from "vue";
import { observeAuthState } from "./firebaseAuth";
import useFlowStore from "@/stores/flowStore";

const db = getDatabase();
const REF = "flowModel";
let unsubscribers = [];

// set

export function createUserData(user) {
  set(ref(db, REF + "/users/" + user.uid + "/name"), user.name);
  set(ref(db, REF + "/users/" + user.uid + "/ideas"), []);
  set(ref(db, REF + "/users/" + user.uid + "/isRequesting"), false);

  console.log("Firebase user data created");
}

// get

export function getChatKey(notifyACB) {
  function dataLoaded(data) {
    if (data.exists()) {
      notifyACB(data.val());
    }
  }

  get(child(ref(db), REF + "/CHAT_KEY"))
    .then(dataLoaded)
    .catch((error) => { console.error(error); });
}

// start/stop

export function setUpFirebase() {
  function signedInACB(user) {
    useFlowStore().user = user;

    function dataLoadedACB() {
      enableFirebaseSync();
    }

    // load existing data, then start sync
    loadFirebaseData(dataLoadedACB);
  }

  function signedOutACB() {
    disableFirebaseSync();
    useFlowStore().user = null;
    useFlowStore().ideas = {};
    useFlowStore().isRequesting = false;
  }

  observeAuthState(signedInACB, signedOutACB);
}

function loadFirebaseData(loadedACB) {
  if (!useFlowStore().user) {
    // user should always be logged in when calling this, but check just in case
    console.warn("can't load Firebase data when logged out");
    return;
  }

  console.log("loading Firebase data ...");

  function commonDataLoadedFromFirebaseACB(data) {
    if (data.exists()) {
      useFlowStore().waterProgress = data.val().waterProgress || 0;
    }

    // load user data
    get(child(ref(db), REF + "/users/" + useFlowStore().user.uid))
      .then(userDataLoadedFromFirebaseACB)
      .catch((error) => { console.error(error); });
  }

  function userDataLoadedFromFirebaseACB(data) {
    if (data.exists()) {
      // load existing user data
      useFlowStore().ideas = data.val().ideas || {};
      useFlowStore().isRequesting = data.val().isRequesting || false;
    }
    else {
      // no existing user data
      useFlowStore().ideas = {};
      useFlowStore().isRequesting = false;
    }

    console.log("Firebase account data loaded");
    loadedACB();
  }

  // load data from Firebase, then set up sync
  get(child(ref(db), REF + "/waterProgress"))
    .then(commonDataLoadedFromFirebaseACB)
    .catch((error) => { console.error(error); });
}

function enableFirebaseSync() {
  // set up sync after first load
  updateFirebaseFromStore(useFlowStore());
  updateStoreFromFirebase(useFlowStore());
  console.log("Firebase synced");
}

function disableFirebaseSync() {
  unsubscribers.forEach(unsubscribe => unsubscribe());
  unsubscribers = [];
  console.log("Firebase desynced");
}

// sync

function updateFirebaseFromStore(store) {
  function ideasChangedInStoreACB(newIdeas) {
    set(ref(db, REF + "/users/" + store.user.uid + "/ideas/"), newIdeas);
  }

  function isRequestingChangedInStoreACB(newState) {
    set(ref(db, REF + "/users/" + store.user.uid + "/isRequesting"), newState);
  }

  function waterProgressChangedInStoreACB(newWaterProgress) {
    set(ref(db, REF + "/waterProgress"), newWaterProgress);
  }

  unsubscribers = [
    ...unsubscribers,
    watch(() => store.ideas, ideasChangedInStoreACB, {deep: true}),
    watch(() => store.isRequesting, isRequestingChangedInStoreACB),
    watch(() => store.waterProgress, waterProgressChangedInStoreACB),
  ];
}

function updateStoreFromFirebase(store) {
  function ideaAddedInFirebaseACB(data) {
    store.addIdea(data.val());
  }

  function ideaRemovedInFirebaseACB(data) {
    store.removeIdea(data.val().epoch);
  }

  function ideaChangedInFirebaseACB(data) {
    store.editIdea(data.val());
  }

  function isRequestingChangedInFirebaseACB(data) {
    if (store.isRequesting !== data.val()) {
      store.isRequesting = data.val();
    }
  }

  function waterProgressChangedInFirebaseACB(data) {
    if (store.waterProgress !== data.val()) {
      store.waterProgress = data.val();
    }
  }

  unsubscribers = [
    ...unsubscribers,
    onChildAdded(ref(db, REF + "/users/" + store.user.uid + "/ideas"), ideaAddedInFirebaseACB),
    onChildRemoved(ref(db, REF + "/users/" + store.user.uid + "/ideas"), ideaRemovedInFirebaseACB),
    onChildChanged(ref(db, REF + "/users/" + store.user.uid + "/ideas"), ideaChangedInFirebaseACB),
    onValue(ref(db, REF + "/users/" + store.user.uid + "/isRequesting"), isRequestingChangedInFirebaseACB),
    onValue(ref(db, REF + "/waterProgress"), waterProgressChangedInFirebaseACB),
  ];
}
