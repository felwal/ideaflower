export default function NotFoundView(props) {
  return (
    <div>
      <h1>404 Not Found</h1>
      <router-link class="button" style="calc(100% - 2 * var(--spacing-small))" to="/">Return home</router-link>
    </div>
  );
}
