export default function MainView(props) {
  function addPrompt() {
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput.value.trim();

    if (prompt === "") return;

    promptInput.value = "";
    props.onSendPrompt(prompt);
  }

  function addPromptOnKeyAcb(evt) {
    if (evt.key === "Enter") {
      addPrompt();
    }
  }

  function addPromptOnClickAcb(evt) {
    addPrompt();
  }

  function renderMessage(msg) {
    return <li>{msg}</li>;
  }

  return <div>
    <h1>Main</h1>
    <ul>{props.conversation.map(renderMessage)}</ul>
    <input id="prompt" type="text" placeholder="Enter a prompt ..." onKeydown={addPromptOnKeyAcb} />
    <button onClick={addPromptOnClickAcb}>Send</button>
  </div>;
}
