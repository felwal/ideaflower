import useFlowStore from "@/stores/flowStore";
import MainView from "@/views/MainView";

const MainPresenter = {
  render() {
    function onSendPromptACB(prompt) {
      useFlowStore().sendPrompt(prompt);
    }

    return <MainView
      conversation={useFlowStore().conversation.sort((a, b) => a.epoch - b.epoch)}
      onSendPrompt={onSendPromptACB} />;
  }
};

export default MainPresenter;
