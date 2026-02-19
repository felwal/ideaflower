import useFlowStore from "@/stores/flowStore";

export default function ProfileView(props) {

  function signInACB() {
    const nameInput = document.getElementById("username");
    props.onSignIn(nameInput.value.trim().replaceAll(" ", "_").toLowerCase());
  }

  function signOutACB() {
    props.onSignOut();
  }

  function signOnKeyACB(evt) {
    if (evt.key === "Enter") {
      props.username ? signOutACB() : signInACB();
    }
  }

  function regeneratePlantsACB(evt) {
    props.onRegeneratePlants();
  }

  return (
    <div>
      <h1>Profile</h1>

      <div class="input-button-row">
        <input id="username" type="text" placeholder="Enter username ..." value={props.username} onKeydown={signOnKeyACB} disabled={props.username !== ""} />

        {props.username
          ? <button onClick={signOutACB}>Sign out</button>
          : <button onClick={signInACB}>Sign in</button>
        }

        {process.env.NODE_ENV === "development" &&
          // NOTE: only show in dev
          <button onClick={regeneratePlantsACB}>Regenerate plants</button>
        }
      </div>

      {props.invalidLogin
        ? <p class="caption caption--error">Invalid username</p>
        : props.username && <p class="caption caption--success">{"Signed in as " + props.username}</p>
      }
    </div>
  );
}
