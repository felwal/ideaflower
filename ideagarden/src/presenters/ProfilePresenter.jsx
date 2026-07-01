import { useHead } from "@vueuse/head";
import { signOutUser, signUpUser, signInUser } from "@/persistance/firebaseAuth";
import { createUserData } from "@/persistance/firebaseModel.js";
import useFlowStore from "@/stores/flowStore";
import { resolvePromise } from "@/utils/resolvePromise";
import ProfileView from "@/views/ProfileView";

const ProfilePresenter = {
  data() {
    return {
      username: "",
      authPromiseState: {},
      isLoginInvalid: false,
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
        this.isLoginInvalid = false;
        createUserData(store.user);
      }
    }

    function signInResultACB() {
      if (this.authPromiseState.error) {
        if (this.authPromiseState.error.code === "auth/invalid-credential") {
          console.log("user doesn't exist");

          this.isLoginInvalid = true;

          // NOTE: only sign up new users in dev
          if (process.env.NODE_ENV === "development") {
            resolvePromise(signUpUser(this.username), this.authPromiseState, null, signUpResultACB.bind(this));
          }

          return;
        }

        console.error(this.authPromiseState.error.code);
      }
      else {
        this.isLoginInvalid = false;
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

    function onExportDataACB() {
      // create file
      const content = useFlowStore().exportIdeasContent();
      const file = new Blob([content], { type: 'text/markdown' });

      // create link to download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "ideaflower.md";

      // save file
      link.click();
      URL.revokeObjectURL(link.href);
    }

    return (
      <ProfileView
        username={store.user?.name ?? ""}
        onSignIn={onSignInACB.bind(this)}
        onSignOut={onSignOutACB.bind(this)}
        onExportData={onExportDataACB}
        onRegeneratePlants={onRegeneratePlantsACB.bind(this)}
        isLoginInvalid={this.isLoginInvalid}
      />
    );
  },
};

export default ProfilePresenter;
