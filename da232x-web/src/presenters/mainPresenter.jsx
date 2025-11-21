import { useStore } from "@/stores/store";

import MainView from "../views/mainView";

const MainPresenter = {
  render() {
    const store = useStore();

    function onAddPromptAcb(prompt) {
      store.addPrompt(prompt);
    }

    return <MainView
      conversation={store.conversation}
      onSendPrompt={onAddPromptAcb} />;
  }
};

export default MainPresenter;
