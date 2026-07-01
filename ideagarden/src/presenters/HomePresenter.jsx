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

      useFlowStore().plantIdeaSeed(prompt);
    }

    if (useFlowStore().canGrowIdea) {
      useFlowStore().requestIdeaGrowth();
    }

    return (
      <HomeView
        ideas={useFlowStore().ideasArray.sort((a, b) => a.epoch - b.epoch)}
        onSendPrompt={onSendPromptACB.bind(this)}
        waterProgress={useFlowStore().waterProgress}
        plantBeingWateredEpoch={useFlowStore().plantBeingWateredEpoch}
        isSignedIn={useFlowStore().isSignedIn}
        isLoading={useFlowStore().isPromiseLoading}
        isInitialized={!useFlowStore().isSignedIn || useFlowStore().isInitialized}
      />
    );
  },
};

export default HomePresenter;
