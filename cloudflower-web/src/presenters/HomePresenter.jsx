import useFlowStore from "@/stores/flowStore";
import HomeView from "@/views/HomeView";

const HomePresenter = {
  render() {
    function onSendPromptACB(prompt) {
      useFlowStore().sendPrompt(prompt);
    }

    return (
      <HomeView
        conversation={useFlowStore().conversation.sort((a, b) => a.epoch - b.epoch)}
        onSendPrompt={onSendPromptACB}
        waterLevel={useFlowStore().waterLevel}
        isSignedIn={useFlowStore().user !== null} />
    );
  }
};

export default HomePresenter;
