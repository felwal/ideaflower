export default function ErrorView(props) {
  function returnHomeClickACB() {
    props.onReturnHome();
  }

  return (
    <div>
      <h1>404 Not Found</h1>
      <button style="width: 100%" onClick={returnHomeClickACB}>Return home</button>
    </div>
  );
}
