import ErrorView from "@/views/ErrorView";
import { useHead } from "@vueuse/head";

const ErrorPresenter = {
  setup() {
    useHead({title: "404 | Ideaflower"})
  },

  render() {
    function returnHomeACB() {
      this.$router.push({name: "home"});
    }

    return <ErrorView onReturnHome={returnHomeACB.bind(this)} />;
  },
};

export default ErrorPresenter;
