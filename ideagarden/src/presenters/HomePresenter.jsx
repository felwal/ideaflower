import useFlowStore from "@/stores/flowStore";
import HomeView from "@/views/HomeView";
import { evolveIdea, chatResponseMock } from "@/network/chatService";
import { resolvePromise, isPromiseLoading, resolvePromiseMock } from "@/utils/resolvePromise";
import { getChatKey } from "@/persistance/firebaseModel";

const HomePresenter = {
  data() {
    return {
      chatPromiseState: {}
    };
  },

  computed: {
    plantFullyWatered() {
      return useFlowStore().plantFullyWatered
    }
  },

  render() {
    function processAPIResultACB() {
      console.log("api call completed");

      if (this.chatPromiseState.error) {
        console.error("api error:", this.chatPromiseState.error);
        return;
      }

      if (this.chatPromiseState.data) {
        //console.log("api response data:", this.chatPromiseState.data);
        useFlowStore().growIdea(this.chatPromiseState.data.output_text);
      }
    }

    function onSendPromptACB(prompt) {
      if (isPromiseLoading(this.chatPromiseState)) {
        console.log("api call still in progress, ignoring new prompt");
        return;
      }

      useFlowStore().plantIdea(prompt);
    }

    function onAddWaterACB() {
      useFlowStore().addWater();
    }

    if (this.plantFullyWatered) {
      useFlowStore().waterLevel = 0;

      getChatKey(key =>
        resolvePromise(evolveIdea(key, useFlowStore().firstUngrownIdea.prompt), this.chatPromiseState, processAPIResultACB.bind(this))
        //resolvePromiseMock(chatResponseMock, this.chatPromiseState, processAPIResultACB.bind(this))
      );
    }

    return (
      <HomeView
        ideas={Object.values(useFlowStore().ideas).sort((a, b) => a.epoch - b.epoch)}
        onSendPrompt={onSendPromptACB.bind(this)}
        onAddWater={onAddWaterACB.bind(this)}
        waterLevel={useFlowStore().waterLevel}
        plantBeingWateredEpoch={useFlowStore().firstUngrownIdea?.epoch}
        isSignedIn={useFlowStore().user !== null}
        isLoading={isPromiseLoading(this.chatPromiseState)} />
    );
  }
};

export default HomePresenter;
