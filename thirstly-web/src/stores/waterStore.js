import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useWaterStore = defineStore("water", () => {
  const conversation = ref(["Hello!", "How can I help you?"]);

  function addPrompt(msg) {
    conversation.value.push(msg);
  }

  function addResponse(msg) {
    conversation.value.push(msg);
  }

  return { conversation, addPrompt, addResponse };
});
