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
      invalidLogin: false,
    };
  },

  render() {
    const store = useFlowStore();

    function signUpResultACB() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/email-already-in-use") {
          console.log("user already exists");
          return;
        }

        console.error(this.authPromiseState.error.code);
      }

      if (this.authPromiseState.data !== null) {
        this.invalidLogin = false;
        createUserData(store.user);
        //this.$router.push({name: "home"});
      }
    }

    function signInResultACB() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/invalid-credential") {
          console.log("user doesn't exist");

          this.invalidLogin = true;
          // NOTE: only sign up new users in dev
          //resolvePromise(signUpUser(this.username), this.authPromiseState, signUpResultACB.bind(this));

          return;
        }

        console.error(this.authPromiseState.error.code);
      }
      else {
        this.invalidLogin = false;
      }
    }

    function onSignInACB(username) {
      this.username = username;
      resolvePromise(signInUser(username), this.authPromiseState, signInResultACB.bind(this));
    }

    function onSignOutACB() {
      signOutUser();
    }

    return (
      <ProfileView
        username={store.user?.name ?? ""}
        onSignIn={onSignInACB.bind(this)}
        onSignOut={onSignOutACB.bind(this)}
        invalidLogin={this.invalidLogin}
      />
    );
  },
};

export default ProfilePresenter;
