import { useRoute } from "vue-router";

export default function App() {
  return (
    <div class="app-view">
      <header>
        <div class="header__content column">
          <router-link to="/">
            <div class="header__glyph">
              <img src="/glyph.svg" class="header__glyph__image" />
            </div>
          </router-link>

          <nav class="header__nav">
            {useRoute().name === "home"
              ? <router-link to="/profile">Profile</router-link>
              : <router-link to="/">Home</router-link>
            }
          </nav>
        </div>
      </header>

      <main class="column">
        <router-view />
      </main>
    </div>
  );
}
