import { defineStore } from "pinia";

const useFlowStore = defineStore("flow", {
  state: () => ({
    user: undefined,
    waterLevel: 0,
    ideas: {}
  }),

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

    plantIdea(prompt) {
      this.waterLevel = 0;
      const idea = {
        prompt: prompt,
        result: null,
        name: null,
        epoch: Date.now()
      };

      this.ideas = {...this.ideas, [idea.epoch]: idea};
    },

    growIdea(result, epoch=null) {
      const epochs = Object.keys(this.ideas);

      if (!epoch && epochs.length > 0) {
        // TEMP: evolve the last idea as default
        epoch = epochs.reverse()[0];
      }
      else if (!(epoch in this.ideas)) {
        console.warn("unable to grow non-existent idea " + epoch);
        return;
      }

      const idea = this.ideas[epoch];
      idea.name = result.substring(1, result.indexOf("]"));
      idea.result = result.substring(result.indexOf("]") + 2);
      this.ideas[epoch] = idea;
    },
  }
});

export default useFlowStore;
