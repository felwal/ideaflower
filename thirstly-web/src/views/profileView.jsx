export default function ProfileView(props) {

  function signInAcb() {
    const nameInput = document.getElementById("username");
    props.onSignIn(nameInput.value.trim().replaceAll(" ", "_").toLowerCase());
  }

  function signOutAcb() {
    props.onSignOut();
  }

  function signOnKeyAcb(evt) {
    if (evt.key === "Enter") {
      props.username ? signOutAcb() : signInAcb();
    }
  }

  return <div>
    <h1>Profile</h1>
    <input id="username" type="text" placeholder="Enter username ..." value={props.username} onKeydown={signOnKeyAcb} disabled={props.username !== ""} />

    {props.username
        ? <button onClick={signOutAcb}>Sign out</button>
        : <button onClick={signInAcb}>Sign in</button>}
  </div>;
}
