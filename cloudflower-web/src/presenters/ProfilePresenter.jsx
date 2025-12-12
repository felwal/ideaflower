import { signOutUser, signUpUser, signInUser } from "@/persistance/firebaseAuth";
import { createUserData } from "@/persistance/firebaseModel.js";
import useFlowStore from "@/stores/flowStore";
import ProfileView from "@/views/ProfileView";
import { resolvePromise } from "@/utils/resolvePromise";

const ProfilePresenter = {
  data() {
    return {
      username: "",
      authPromiseState: {},
      isSignedUp: false
    };
  },

  render() {
    const store = useFlowStore();

    function authResultACB() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/email-already-in-use") {
          console.log("user already exists, signing in instead");
          this.isSignedUp = true;
          resolvePromise(signInUser(this.username), this.authPromiseState, authResultACB.bind(this));
          return;
        }

        console.error(this.authPromiseState.error.code);
      }

      if (this.authPromiseState.data !== null && !this.isSignedUp) {
        createUserData(store.user);
        //this.$router.push({name: "home"});
      }
    }

    function onSignInACB(username) {
      this.username = username;
      resolvePromise(signUpUser(username), this.authPromiseState, authResultACB.bind(this));
    }

    function onSignOutACB() {
      signOutUser();
    }

    return (
      <ProfileView
        username={store.user?.name ?? ""}
        onSignIn={onSignInACB.bind(this)}
        onSignOut={onSignOutACB.bind(this)} />
    );
  }
};

export default ProfilePresenter;
