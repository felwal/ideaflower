import { getDatabase, ref, set, onChildAdded, onChildRemoved, get, child, onValue } from "firebase/database";
import { watch } from "vue";
import { observeAuthState } from "./firebaseAuth";
import { useWaterStore } from "@/stores/waterStore";

const db = getDatabase();
const REF = "waterModel";
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
  function signedInAcb(user) {
    useWaterStore().user = user;

    function dataLoadedAcb() {
      enableFirebaseSync();
    }

    // load existing data, then start sync
    loadFirebaseData(dataLoadedAcb);
  }

  function signedOutAcb() {
    disableFirebaseSync();
    useWaterStore().user = null;
    useWaterStore().conversation = [];
  }

  observeAuthState(signedInAcb, signedOutAcb);
}

function loadFirebaseData(loadedAcb) {
  if (!useWaterStore().user) {
    // user should always be logged in when calling this, but check just in case
    console.warn("can't load Firebase data when logged out");
  }

  console.log("loading Firebase data ...");

  function dataLoadedFromFirebaseAcb(data) {
    if (data.exists()) {
      // load existing user data
      useWaterStore().conversation = Object.values(data.val().conversation || {});
      useWaterStore().waterLevel = data.val().waterLevel || 0;
    }
    else {
      // no existing user data
      useWaterStore().conversation = [];
    }

    console.log("Firebase account data loaded");
    loadedAcb();
  }

  // load data from Firebase, then set up sync
  get(child(ref(db), REF + "/users/" + useWaterStore().user.uid))
    .then(dataLoadedFromFirebaseAcb)
    .catch((error) => { console.error(error); });
}

function enableFirebaseSync() {
  // set up sync after first load
  updateFirebaseFromStore(useWaterStore());
  updateStoreFromFirebase(useWaterStore());
  console.log("Firebase synced");
}

function disableFirebaseSync() {
  unsubscribers.forEach(unsubscribe => unsubscribe());
  unsubscribers = [];
  console.log("Firebase desynced");
}

// sync

function updateFirebaseFromStore(store) {
  function conversationChangedInStoreAcb(newConversation) {
    function toDateKeyedObjectCb(obj, msg) {
      return {...obj, [msg.epoch]: msg};
    }

    const conversationObj = newConversation.reduce(toDateKeyedObjectCb, {});
    set(ref(db, REF + "/users/" + store.user.uid + "/conversation/"), conversationObj);
  }

  function waterLevelChangedInStoreAcb(newWaterLevel) {
    set(ref(db, REF + "/users/" + store.user.uid + "/waterLevel"), newWaterLevel);
  }

  unsubscribers = [
    ...unsubscribers,
    watch(() => store.conversation, conversationChangedInStoreAcb),
    watch(() => store.waterLevel, waterLevelChangedInStoreAcb)];
}

function updateStoreFromFirebase(store) {
  function msgAddedInFirebaseAcb(data) {
    store.addMessage(data.val());
  }

  function msgRemovedInFirebaseAcb(data) {
    store.removeMessage(data.val().epoch);
  }

  function waterLevelChangedInFirebaseAcb(data) {
    if (store.waterLevel !== data.val()) {
      store.waterLevel = data.val();
    }
  }

  unsubscribers = [
    ...unsubscribers,
    onChildAdded(ref(db, REF + "/users/" + store.user.uid + "/conversation"), msgAddedInFirebaseAcb),
    onChildRemoved(ref(db, REF + "/users/" + store.user.uid + "/conversation"), msgRemovedInFirebaseAcb),
    onValue(ref(db, REF + "/users/" + store.user.uid + "/waterLevel"), waterLevelChangedInFirebaseAcb)
  ];
}
