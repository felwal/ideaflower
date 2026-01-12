import useFlowStore from "@/stores/flowStore";
import HomeView from "@/views/HomeView";
import { evolveIdea } from "@/network/chatService";
import { resolvePromise, isPromiseLoading } from "@/utils/resolvePromise";

const HomePresenter = {
  data() {
    return {
      chatPromiseState: {}
    };
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
      resolvePromise(evolveIdea(prompt), this.chatPromiseState, processAPIResultACB.bind(this));
    }

    console.log(useFlowStore().ideas);

    return (
      <HomeView
        ideas={Object.values(useFlowStore().ideas).sort((a, b) => a.epoch - b.epoch)}
        onSendPrompt={onSendPromptACB.bind(this)}
        waterLevel={useFlowStore().waterLevel}
        isSignedIn={useFlowStore().user !== null}
        isLoaing={isPromiseLoading(this.chatPromiseState)} />
    );
  }
};

export default HomePresenter;
