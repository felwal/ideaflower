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

  function exportDataACB(evt) {
    props.onExportData();
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
      </div>

      {props.isLoginInvalid
        ? <p class="caption caption--indented caption--error">Invalid username</p>
        : props.username && <p class="caption caption--indented caption--success">{"Signed in as " + props.username}</p>
      }

      {props.username &&
        <div class="input-button-row">
          <button onClick={exportDataACB}>Export data</button>

          {process.env.NODE_ENV === "development" &&
            // NOTE: only show in dev
            <button onClick={regeneratePlantsACB}>Regenerate plants</button>
          }
        </div>
      }
    </div>
  );
}
