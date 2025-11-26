import { getDatabase, ref, set, onChildAdded, onChildRemoved, get, child, onValue } from "firebase/database";
import { watch } from "vue";
import { observeAuthState } from "./firebaseAuth";
import useFlowStore from "@/stores/flowStore";

const db = getDatabase();
const REF = "flowModel";
let unsubscribers = [];

// set

export function createUserData(user) {
  set(ref(db, REF + "/users/" + user.uid + "/name"), user.name);
  set(ref(db, REF + "/users/" + user.uid + "/conversation"), []);
  set(ref(db, REF + "/users/" + user.uid + "/waterLevel"), 0);

  console.log("Firebase user data created");
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
    useFlowStore().conversation = [];
  }

  observeAuthState(signedInACB, signedOutACB);
}

function loadFirebaseData(loadedACB) {
  if (!useFlowStore().user) {
    // user should always be logged in when calling this, but check just in case
    console.warn("can't load Firebase data when logged out");
  }

  console.log("loading Firebase data ...");

  function dataLoadedFromFirebaseACB(data) {
    if (data.exists()) {
      // load existing user data
      useFlowStore().conversation = Object.values(data.val().conversation || {});
      useFlowStore().waterLevel = data.val().waterLevel || 0;
    }
    else {
      // no existing user data
      useFlowStore().conversation = [];
    }

    console.log("Firebase account data loaded");
    loadedACB();
  }

  // load data from Firebase, then set up sync
  get(child(ref(db), REF + "/users/" + useFlowStore().user.uid))
    .then(dataLoadedFromFirebaseACB)
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
  function conversationChangedInStoreACB(newConversation) {
    function toDateKeyedObjectCB(obj, msg) {
      return {...obj, [msg.epoch]: msg};
    }

    const conversationObj = newConversation.reduce(toDateKeyedObjectCB, {});
    set(ref(db, REF + "/users/" + store.user.uid + "/conversation/"), conversationObj);
  }

  function waterLevelChangedInStoreACB(newWaterLevel) {
    set(ref(db, REF + "/users/" + store.user.uid + "/waterLevel"), newWaterLevel);
  }

  unsubscribers = [
    ...unsubscribers,
    watch(() => store.conversation, conversationChangedInStoreACB),
    watch(() => store.waterLevel, waterLevelChangedInStoreACB)];
}

function updateStoreFromFirebase(store) {
  function msgAddedInFirebaseACB(data) {
    store.addMessage(data.val());
  }

  function msgRemovedInFirebaseACB(data) {
    store.removeMessage(data.val().epoch);
  }

  function waterLevelChangedInFirebaseACB(data) {
    if (store.waterLevel !== data.val()) {
      store.waterLevel = data.val();
    }
  }

  unsubscribers = [
    ...unsubscribers,
    onChildAdded(ref(db, REF + "/users/" + store.user.uid + "/conversation"), msgAddedInFirebaseACB),
    onChildRemoved(ref(db, REF + "/users/" + store.user.uid + "/conversation"), msgRemovedInFirebaseACB),
    onValue(ref(db, REF + "/users/" + store.user.uid + "/waterLevel"), waterLevelChangedInFirebaseACB)
  ];
}
