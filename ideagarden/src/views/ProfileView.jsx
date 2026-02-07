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

  return (
    <div>
      <h1>Profile</h1>

      <div class="input-btn-row">
        <input id="username" type="text" placeholder="Enter username ..." value={props.username} onKeydown={signOnKeyACB} disabled={props.username !== ""} />

        {props.username
          ? <button onClick={signOutACB}>Sign out</button>
          : <button onClick={signInACB}>Sign in</button>
        }
      </div>
    </div>
  );
}
