import useFlowStore from "@/stores/flowStore";
import { isPromiseLoading } from "@/utils/resolvePromise";
import DetailView from "@/views/DetailView";
import { useHead } from "@vueuse/head";
import { useRoute } from "vue-router";

const DetailPresenter = {
  setup() {
    const ideaName = useFlowStore().getIdea(useRoute().params.id)?.name;
    useHead({title: (ideaName ? ideaName : "Ungrown idea") + " | Ideaflower"});
  },

  render() {
    const idea = useFlowStore().getIdea(this.$route.params.id);

    // loading or invalid id
    if (!idea) return;

    if (idea.result) {
      idea.read = true;
    }

    if (useFlowStore().canGrowIdea) {
      useFlowStore().manageAPICall();
    }

    return (
      <DetailView
        idea={idea}
        isPlantBeingWatered={idea.epoch === useFlowStore().firstUngrownIdea?.epoch}
        waterProgress={useFlowStore().waterProgress}
        isLoading={isPromiseLoading(useFlowStore().chatPromiseState)}
      />
    );
  }
};

export default DetailPresenter;
