import NotFoundView from "@/views/NotFoundView";
import { useHead } from "@vueuse/head";

const NotFoundPresenter = {
  setup() {
    useHead({title: "Not Found | Ideaflower"})
  },

  render() {
    return <NotFoundView />;
  },
};

export default NotFoundPresenter;
