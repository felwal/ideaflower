import { signOutUser, signUpUser, signInUser } from "@/persistance/firebaseAuth";
import { createUserData } from "@/persistance/firebaseModel.js";
import useFlowStore from "@/stores/flowStore";
import ProfileView from "@/views/ProfileView";
import { resolvePromise } from "@/utils/resolvePromise";
import { useHead } from "@vueuse/head";

const ProfilePresenter = {
  data() {
    return {
      username: "",
      authPromiseState: {},
      invalidLogin: false,
    };
  },

  setup() {
    useHead({title: "Profile | Ideaflower"})
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
      }
    }

    function signInResultACB() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/invalid-credential") {
          console.log("user doesn't exist");

          this.invalidLogin = true;

          // NOTE: only sign up new users in dev
          if (process.env.NODE_ENV === "development") {
            resolvePromise(signUpUser(this.username), this.authPromiseState, null, signUpResultACB.bind(this));
          }

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
      resolvePromise(signInUser(username), this.authPromiseState, null, signInResultACB.bind(this));
    }

    function onSignOutACB() {
      signOutUser();
    }

    function onRegeneratePlantsACB() {
      useFlowStore().regeneratePlants();
    }

    return (
      <ProfileView
        username={store.user?.name ?? ""}
        onSignIn={onSignInACB.bind(this)}
        onSignOut={onSignOutACB.bind(this)}
        onRegeneratePlants={onRegeneratePlantsACB.bind(this)}
        invalidLogin={this.invalidLogin}
      />
    );
  },
};

export default ProfilePresenter;
