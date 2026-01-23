import { randomBool } from "@/utils/mathUtils";
import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    waterProgress: 0,
    isRequesting: false,
    ideas: {}
  }),

  getters: {
    plantFullyWatered: (state) => state.waterProgress >= 1,
    firstUngrownIdea: (state) => Object.values(state.ideas).filter(idea => !idea.result)[0]
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

    addWater() {
      this.waterProgress = Math.min(this.waterProgress + 0.1, 1);
    },

    useWater() {
      this.waterProgress = Math.max(this.waterProgress - 1, 0);
      this.isRequesting = true;
    },

    plantIdea(prompt) {
      const idea = {
        prompt: prompt,
        result: null,
        name: null,
        potWide: randomBool(),
        potSaturation: parseFloat(Math.random().toFixed(2)),
        leafPath: null,
        leafHue: parseFloat(Math.random().toFixed(2)),
        leafLightness: parseFloat(Math.random().toFixed(2)),
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
    }
  }
});

export default useFlowStore;
