import useFlowStore from "@/stores/flowStore";
import { isPromiseLoading } from "@/utils/resolvePromise";
import DetailView from "@/views/DetailView";
import { useHead } from "@vueuse/head";
import { useRoute } from "vue-router";

const DetailPresenter = {
  data() {
    return {
      idea: null,
    };
  },

  setup() {
    const ideaName = useFlowStore().getIdea(useRoute().params.id)?.name;
    useHead({title: (ideaName ? ideaName : "Idea") + " | Ideaflower"});
  },

  render() {
    function onDeleteIdeaACB() {
      useFlowStore().removeIdea(this.idea.epoch);
      this.$router.push({name: "home"});
    }

    if (!this.idea) {
      const idea = useFlowStore().getIdea(this.$route.params.id);

      // loading or invalid id
      if (!idea) return;

      useHead({title: (idea.name ? idea.name : "Ungrown idea") + " | Ideaflower"});
      this.idea = idea;
    }

    if (this.idea.result) {
      this.idea.read = true;
    }

    if (useFlowStore().canGrowIdea) {
      useFlowStore().manageAPICall();
    }

    return (
      <DetailView
        idea={this.idea}
        isPlantBeingWatered={this.idea.epoch === useFlowStore().firstUngrownIdea?.epoch}
        waterProgress={useFlowStore().waterProgress}
        isLoading={isPromiseLoading(useFlowStore().chatPromiseState)}
        onDeleteIdea={onDeleteIdeaACB.bind(this)}
      />
    );
  }
};

export default DetailPresenter;
