import useFlowStore from "@/stores/flowStore";
import HomeView from "@/views/HomeView";
import { isPromiseLoading } from "@/utils/resolvePromise";
import { useHead } from "@vueuse/head";

const HomePresenter = {
  setup() {
    useHead({title: "Ideaflower"})
  },

  render() {
    function onSendPromptACB(prompt) {
      if (useFlowStore().isPromiseLoading) {
        console.log("api call still in progress, ignoring new prompt");
        return;
      }

      useFlowStore().plantIdea(prompt);
    }

    if (useFlowStore().canGrowIdea) {
      useFlowStore().manageAPICall();
    }

    return (
      <HomeView
        ideas={Object.values(useFlowStore().ideas || {}).sort((a, b) => a.epoch - b.epoch)}
        onSendPrompt={onSendPromptACB.bind(this)}
        waterProgress={useFlowStore().waterProgress}
        plantBeingWateredEpoch={useFlowStore().firstUngrownIdea?.epoch}
        isSignedIn={useFlowStore().isSignedIn}
        isLoading={useFlowStore().isPromiseLoading}
        isInitialized={!useFlowStore().isSignedIn || useFlowStore().isInitialized}
      />
    );
  },
};

export default HomePresenter;
