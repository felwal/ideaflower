import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const conversation = ref(["Hello!", "How can I help you?"]);

  function addPrompt(msg) {
    conversation.value.push(msg);
  }

  return { conversation, addPrompt };
});
