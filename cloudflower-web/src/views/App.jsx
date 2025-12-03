import "@/css/index.css";

export default function App() {
  return (
    <div class="app-view">
      <header>
        <div class="header__content column">
          <a href="/">
            <div class="header__logo">
              <img src="/favicon.svg" class="header__logo__image" />
            </div>
          </a>
          <nav class="header__nav">
            <router-link to="/">Home</router-link>
            <router-link to="/profile">Profile</router-link>
          </nav>
        </div>
      </header>
      <main class="column">
        <router-view />
      </main>
    </div>
  );
}
