import { chatResponseMock, evolveIdea } from "@/network/chatService";
import { getChatKey } from "@/persistance/firebaseModel";
import { randomFloatRounded } from "@/utils/mathUtils";
import { resolvePromiseMock } from "@/utils/resolvePromise";
import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    waterProgress: 0,
    isRequesting: false,
    ideas: {},
    chatPromiseState: {},
  }),

  getters: {
    plantFullyWatered: (state) => state.waterProgress >= 1,
    ungrownIdeas: (state) => Object.values(state.ideas).filter(idea => !idea.result),
    firstUngrownIdea: (state) => state.ungrownIdeas[0],
    canGrowIdea: (state) => state.firstUngrownIdea && state.plantFullyWatered && !state.isRequesting,
  },

  actions: {
    addIdea(idea) {
      if (idea.epoch in this.ideas) {
        // don't add duplicates
        return;
      }

      this.ideas = {...this.ideas, [idea.epoch]: idea}
    },

    removeIdea(epoch) {
      delete this.ideas[epoch];
    },

    editIdea(idea) {
      if (!(idea.epoch in this.ideas)) {
        console.warn("unable to edit non-existent idea " + idea.epoch);
        return;
      }

      this.ideas[idea.epoch] = idea;
    },

    useWater() {
      if (this.ungrownIdeas.length <= 1) this.waterProgress = -1;
      else this.waterProgress = Math.max(this.waterProgress - 1, 0);

      this.isRequesting = true;
    },

    plantIdea(prompt) {
      if (!this.firstUngrownIdea) {
        this.waterProgress = 0;
      }

      const idea = {
        prompt: prompt,
        result: null,
        name: null,
        read: false,
        potShape: randomFloatRounded(),
        potSaturation: randomFloatRounded(),
        leafHue: randomFloatRounded(),
        leafLightness: randomFloatRounded(),
        leafPath: null,
        epoch: Date.now()
      };

      this.ideas = {...this.ideas, [idea.epoch]: idea};
      return idea;
    },

    growIdea(result) {
      this.firstUngrownIdea.name = result.substring(1, result.indexOf("]"));
      this.firstUngrownIdea.result = result.substring(result.indexOf("]") + 2).trim();
    },

    getIdea(epoch) {
      return epoch in this.ideas ? this.ideas[epoch] : null;
    },

    manageAPICall() {
      function processAPIResultACB() {
        console.log("api call completed");

        if (this.chatPromiseState.error) {
          console.error("api error:", this.chatPromiseState.error);
        }
        else if (this.chatPromiseState.data) {
          //console.log("api response data:", this.chatPromiseState.data);
          this.growIdea(this.chatPromiseState.data.output_text);
        }

        this.isRequesting = false;
      }

      this.useWater();

      getChatKey(key =>
        //resolvePromise(evolveIdea(key, this.firstUngrownIdea.prompt), this.chatPromiseState, processAPIResultACB.bind(this))
        resolvePromiseMock(chatResponseMock, this.chatPromiseState, processAPIResultACB.bind(this))
      );
    }
  },
});

export default useFlowStore;
