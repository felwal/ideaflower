export default function App() {
  return <div>
    <div>
      <router-link to="/">Main</router-link>
    </div>
    <div>
      <router-view />
    </div>
  </div>;
}
