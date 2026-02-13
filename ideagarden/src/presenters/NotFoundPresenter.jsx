import NotFoundView from "@/views/NotFoundView";
import { useHead } from "@vueuse/head";

const NotFoundPresenter = {
  setup() {
    useHead({title: "404 | Ideaflower"})
  },

  render() {
    function returnHomeACB() {
      this.$router.push({name: "home"});
    }

    return <NotFoundView onReturnHome={returnHomeACB.bind(this)} />;
  },
};

export default NotFoundPresenter;
