import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { PASSWORD } from "./firebaseConfig";
import app from "./firebaseApp";

const auth = getAuth(app);

function email(username) {
  return username + "@example.com";
}

function username(email) {
  return email.split("@")[0];
}

export function signUpUser(username) {
  console.log("signing up as " + username + " ...");
  return createUserWithEmailAndPassword(auth, email(username), PASSWORD);
}

export function signInUser(username) {
  console.log("signing in as " + username + " ...");
  return signInWithEmailAndPassword(auth, email(username), PASSWORD);
}

export function signOutUser() {
  console.log("signing out ...");
  return auth.signOut();
}

export function observeAuthState(signedInACB, signedOutACB) {
  function stateChangedACB(credentialUser) {
    if (credentialUser) {
      const user = {
        uid: credentialUser.uid,
        email: credentialUser.email,
        name: username(credentialUser.email)
      };

      console.log("signed in as " + user.name);
      signedInACB(user);
    }
    else {
      console.log("signed out");
      signedOutACB();
    }
  }

  onAuthStateChanged(auth, stateChangedACB);
}
