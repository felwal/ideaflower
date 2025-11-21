import { useStore } from "@/stores/store";

import MainView from "../views/mainView";

const MainPresenter = {
  render() {
    const store = useStore();

    return <MainView conversation={store.conversation} />;
  }
};

export default MainPresenter;
