import { chatResponseMock, evolveIdea } from "@/network/chatService";
import { getChatKey } from "@/persistance/firebaseModel";
import { randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import { isPromiseLoading, resolvePromise, resolvePromiseMock } from "@/utils/resolvePromise";
import blobshape from "blobshape";
import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    waterProgress: 0,
    wateringCount: 0,
    isRequesting: false,
    ideas: null,
    chatPromiseState: {},
  }),

  getters: {
    ideasArray: (state) => Object.values(state.ideas || {}),
    isSignedIn: (state) => state.user !== null,
    isInitialized: (state) => state.ideas !== null,
    plantFullyWatered: (state) => state.waterProgress >= 1,
    ungrownIdeas: (state) => state.ideasArray.filter(idea => !idea.result),
    firstUngrownIdea: (state) => state.ungrownIdeas[0],
    canGrowIdea: (state) => state.isInitialized && state.firstUngrownIdea && state.plantFullyWatered && !state.isRequesting,
    ideasCount: (state) => state.ideasArray.length,
    isPromiseLoading: (state) => isPromiseLoading(state.chatPromiseState),
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
      // count leftover water as a watering if >=5%
      this.wateringCount = this.waterProgress < 1.05 ? 0 : 1;
      // set to -1 if no remaining ungrown ideas
      this.waterProgress = this.ungrownIdeas.length > 1 ? Math.max(this.waterProgress - 1, 0) : -1;
    },

    plantIdea(prompt) {
      if (!this.firstUngrownIdea) {
        // if there is no existing ungrown idea, reset water
        this.waterProgress = 0;
        this.wateringCount = 0;
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
        wateringCount: null,
        epoch: Date.now(),
        epochGrown: null,
      };

      this.ideas = {...this.ideas, [idea.epoch]: idea};
      return idea;
    },

    growIdea(result) {
      const idea = this.getIdea(this.chatPromiseState.id);

      if (!idea) {
        console.warn("could not find idea " + this.chatPromiseState.id + " to receive api result");
        return;
      }

      idea.name = result.title;
      idea.result = result.text;
      idea.leafHue = roundFloat(1 - result.novelty);
      idea.leafLightness = roundFloat(result.usefulness);
      idea.leafEdges = roundFloat(result.complexity);
      idea.leafRoundness = roundFloat(result.impact);
      idea.leafPath = this.generateLeafPath(idea);
    },

    getIdea(epoch) {
      return this.isInitialized && epoch in this.ideas ? this.ideas[epoch] : null;
    },

    manageAPICall() {
      this.isRequesting = true;

      function processAPIResultACB() {
        console.log("api call completed");

        if (this.chatPromiseState.error) {
          console.error("api error:", this.chatPromiseState.error);
        }
        else if (this.chatPromiseState.data) {
          //console.log(this.chatPromiseState.data.output_text)
          this.growIdea(JSON.parse(this.chatPromiseState.data.output_text));
        }

        this.isRequesting = false;
      }

      const idea = this.firstUngrownIdea;
      idea.epochGrown = Date.now();
      idea.wateringCount = this.wateringCount;
      this.useWater();

      // NOTE: mock only in dev
      getChatKey(key =>
        //resolvePromise(evolveIdea(key, idea), this.chatPromiseState, idea.epoch, processAPIResultACB.bind(this))
        resolvePromiseMock(chatResponseMock, this.chatPromiseState, idea.epoch, processAPIResultACB.bind(this))
      );
    },

    regeneratePlants() {
      this.ideasArray.forEach(idea => {
        idea.potShape = randomFloatRounded();
        idea.potSaturation = randomFloatRounded();
        idea.leafHue ??= randomFloatRounded();
        idea.leafLightness ??= randomFloatRounded();
        idea.leafRoundness ??= randomFloatRounded();
        idea.leafEdges ??= randomFloatRounded();
        idea.leafPath = this.generateLeafPath(idea);
      });
    },

    generateLeafPath(idea) {
      const growthMin = 3;
      const growthMax = 8;
      const growth = growthMin + Math.round((growthMax - growthMin) * idea.leafRoundness);

      const edgesMin = 4;
      const edgesMax = 15;
      const edges = edgesMin + Math.round((edgesMax - edgesMin) * idea.leafEdges);

      const {path} = blobshape({size: 100, growth: growth, edges: edges});
      return path;
    },
  },
});

export default useFlowStore;
