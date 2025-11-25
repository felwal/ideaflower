import { useWaterStore } from "@/stores/waterStore";

import MainView from "../views/mainView";

const MainPresenter = {
  render() {
    function onSendPromptAcb(prompt) {
      useWaterStore().sendPrompt(prompt);
    }

    return <MainView
      conversation={useWaterStore().conversation.sort((a, b) => a.epoch - b.epoch)}
      onSendPrompt={onSendPromptAcb} />;
  }
};

export default MainPresenter;
