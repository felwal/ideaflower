import { defineStore } from "pinia";

export const useWaterStore = defineStore("water", {
  state: () => ({
    user: undefined,
    waterLevel: 0,
    conversation: []
  }),

  actions: {
    addMessage(msg) {
      if (this.conversation.find(m => m.epoch === msg.epoch)) {
        // don't add duplicates
        return;
      }

      this.conversation = [...this.conversation, msg];
    },

    removeMessage(epoch) {
      this.conversation = this.conversation.filter(msg => msg.epoch !== epoch);
    },

    sendPrompt(prompt) {
      this.addMessage({
        epoch: Date.now(),
        text: prompt,
        generated: false
      });
    }
  }
});
