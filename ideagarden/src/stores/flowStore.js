import { chatResponseMock, evolveIdea, getCareShapePrompt } from "@/network/chatService";
import { getChatKey } from "@/persistance/firebaseModel";
import { randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import { resolvePromise, resolvePromiseMock } from "@/utils/resolvePromise";
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
    ideasCount: (state) => Object.values(state.ideas).length,
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
        potShape: this.ideasCount > 0 ? randomFloatRounded() : 0.0,
        potSaturation: this.ideasCount > 0 ? randomFloatRounded(): 0.6,
        leafHue: null,
        leafLightness: null,
        leafEdges: null,
        leafRoundness: null,
        leafPath: null,
        epoch: Date.now()
      };

      this.ideas = {...this.ideas, [idea.epoch]: idea};
      return idea;
    },

    growIdea(result) {
      const idea = this.firstUngrownIdea;

      if (!idea) {
        console.warn("no ungrown ideas to receive api result");
        return;
      }

      idea.name = result.title;
      idea.result = result.text;
      idea.leafHue = roundFloat(1 - result.energy_orientation);
      idea.leafLightness = roundFloat(1 - result.density);
      idea.leafEdges = roundFloat(result.structural_complexity);
      idea.leafRoundness = roundFloat(1 - result.sharpness);
    },

    getIdea(epoch) {
      return epoch in this.ideas ? this.ideas[epoch] : null;
    },

    manageAPICall() {
      this.isRequesting = true;

      function processAPIResultACB() {
        console.log("api call completed");

        if (this.chatPromiseState.error) {
          console.error("api error:", this.chatPromiseState.error);
        }
        else if (this.chatPromiseState.data) {
          this.growIdea(JSON.parse(this.chatPromiseState.data.output_text));
        }

        this.isRequesting = false;
      }

      this.useWater();

      getChatKey(key =>
        resolvePromise(evolveIdea(key, this.firstUngrownIdea), this.chatPromiseState, processAPIResultACB.bind(this))
        //resolvePromiseMock(chatResponseMock, this.chatPromiseState, processAPIResultACB.bind(this))
      );
    }
  },
});

export default useFlowStore;
