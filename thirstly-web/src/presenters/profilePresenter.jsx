import { useWaterStore } from "@/stores/waterStore";
import { signOutUser, signUpUser, signInUser } from "../persistance/firebaseAuth";
import { createUserData } from "@/persistance/firebaseModel.js";

import ProfileView from "../views/profileView";
import resolvePromise from "@/utils/resolvePromise";

const ProfilePresenter = {
  data() {
    return {
      username: "",
      authPromiseState: {},
      isSignedUp: false
    };
  },

  render() {
    const store = useWaterStore();

    function authResultAcb() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/email-already-in-use") {
          console.log("user already exists, signing in instead");
          this.isSignedUp = true;
          resolvePromise(signInUser(this.username), this.authPromiseState, authResultAcb.bind(this));
          return;
        }

        console.error(this.authPromiseState.error.code);
      }

      if (this.authPromiseState.data !== null && !this.isSignedUp) {
        createUserData(store.user);
        //this.$router.push({name: "main"});
      }
    }

    function onSignInAcb(username) {
      this.username = username;
      resolvePromise(signUpUser(username), this.authPromiseState, authResultAcb.bind(this));
    }

    function onSignOutAcb() {
      signOutUser();
    }

    return <ProfileView
      username={store.user?.name ?? ""}
      onSignIn={onSignInAcb.bind(this)}
      onSignOut={onSignOutAcb.bind(this)}
    />;
  }
};

export default ProfilePresenter;
