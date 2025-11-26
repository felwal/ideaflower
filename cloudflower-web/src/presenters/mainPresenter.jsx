import useWaterStore from "@/stores/waterStore";
import MainView from "@/views/MainView";

const MainPresenter = {
  render() {
    function onSendPromptACB(prompt) {
      useWaterStore().sendPrompt(prompt);
    }

    return <MainView
      conversation={useWaterStore().conversation.sort((a, b) => a.epoch - b.epoch)}
      onSendPrompt={onSendPromptACB} />;
  }
};

export default MainPresenter;
