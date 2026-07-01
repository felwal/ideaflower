import { useHead } from "@vueuse/head";
import NotFoundView from "@/views/NotFoundView";

const NotFoundPresenter = {
  setup() {
    useHead({title: "Not Found | Ideaflower"})
  },

  render() {
    return <NotFoundView />;
  },
};

export default NotFoundPresenter;
