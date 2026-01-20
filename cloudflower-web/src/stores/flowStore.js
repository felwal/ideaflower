import { randomBool } from "@/utils/mathUtils";
import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    waterLevel: 0,
    ideas: {}
  }),

  getters: {
    waterProgress: (state) => state.waterLevel / 8.0,
    plantFullyWatered: (state) => state.waterLevel >= 8,
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
      this.waterLevel = Math.min(this.waterLevel + 1, 8);
    },

    plantIdea(prompt) {
      this.waterLevel = 0;

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
