import { useWaterStore } from "@/stores/waterStore";

import MainView from "../views/mainView";

const MainPresenter = {
  render() {
    const store = useWaterStore();

    function onAddPromptAcb(prompt) {
      store.addPrompt(prompt);
    }

    return <MainView
      conversation={store.conversation}
      onSendPrompt={onAddPromptAcb} />;
  }
};

export default MainPresenter;
