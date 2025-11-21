export default function MainView(props) {
  function renderMessage(msg) {
    return <li>{msg}</li>;
  }

  return <div>
    <h1>Main</h1>
    <ul>{props.conversation.map(renderMessage)}</ul>
  </div>;
}
