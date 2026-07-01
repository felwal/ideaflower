import { chatResponseMock, growIdea } from "@/network/chatService";
import { getChatKey } from "@/persistance/firebaseModel";
import { randomFloatRounded, roundFloat } from "@/utils/mathUtils";
import { isPromiseLoading, resolvePromise, resolvePromiseMock } from "@/utils/resolvePromise";
import blobshape from "blobshape";
import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    carerUsername: null,
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
    isUserCarer: (state) => state.user && state.user.name === state.carerUsername,
    isPlantFullyWatered: (state) => state.waterProgress >= 1,
    ungrownIdeas: (state) => state.ideasArray.filter(idea => !idea.result),
    firstUngrownIdea: (state) => state.ungrownIdeas[0],
    plantBeingWateredEpoch: (state) => state.isUserCarer ? state.firstUngrownIdea?.epoch : null,
    canGrowIdea: (state) => state.isUserCarer && state.isInitialized && state.firstUngrownIdea && state.isPlantFullyWatered && !state.isRequesting,
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

    getIdea(epoch) {
      return this.isInitialized && epoch in this.ideas ? this.ideas[epoch] : null;
    },

    // main

    plantIdeaSeed(prompt) {
      if (this.isUserCarer && !this.firstUngrownIdea) {
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

    requestIdeaGrowth() {
      this.isRequesting = true;

      function processAPIResultACB() {
        console.log("api call completed");

        if (this.chatPromiseState.error) {
          console.error("api error:", this.chatPromiseState.error);
        }
        else if (this.chatPromiseState.data) {
          this.addIdeaGrowth(JSON.parse(this.chatPromiseState.data.output_text));
        }

        this.isRequesting = false;
      }

      const idea = this.firstUngrownIdea;
      idea.epochGrown = Date.now();

      // since we allow watering in background even when progress >1,
      // we need to use an average count
      const avgWateringCountPerIdea = this.wateringCount / this.waterProgress;
      idea.wateringCount = Math.ceil(avgWateringCountPerIdea) + 1;
      this.wateringCount = Math.max(this.wateringCount - Math.floor(avgWateringCountPerIdea), 0);
      this.waterProgress = Math.max(this.waterProgress - 1, 0);

      // NOTE: mock only in dev
      getChatKey(key =>
        resolvePromise(growIdea(key, idea), this.chatPromiseState, idea.epoch, processAPIResultACB.bind(this))
        //resolvePromiseMock(chatResponseMock, this.chatPromiseState, idea.epoch, processAPIResultACB.bind(this))
      );
    },

    addIdeaGrowth(result) {
      const idea = this.getIdea(this.chatPromiseState.id);

      if (!idea) {
        console.warn("could not find idea " + this.chatPromiseState.id + " to receive api result");
        return;
      }

      idea.name = result.title;
      idea.result = result.text;
      idea.leafEdges = roundFloat(result.complexity);
      idea.leafLightness = roundFloat(1 - result.impact);
      idea.leafPath = this.generateLeafPath(idea);
    },

    // utils

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
      const growthMin = 2;
      const growthMax = 7;
      const growth = growthMin + Math.round((growthMax - growthMin) * idea.leafRoundness);

      const edgesMin = 4;
      const edgesMax = 16;
      const edges = edgesMin + Math.round((edgesMax - edgesMin) * idea.leafEdges);

      const {path} = blobshape({size: 100, growth: growth, edges: edges});
      return path;
    },

    exportIdeasContent() {
      return this.ideasArray
        .reduce((acc, idea) =>
          [acc, "## " + (idea.name || "Unwatered Idea"), idea.prompt, idea.result && "***", idea.result].filter(it => it).join("\n\n"),
          "# Ideaflower export"
        ) + "\n";
    },
  },
});

export default useFlowStore;
