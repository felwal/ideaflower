import useFlowStore from "@/stores/flowStore";
import { isPromiseLoading } from "@/utils/resolvePromise";
import DetailView from "@/views/DetailView";
import LoadingView from "@/views/LoadingView";
import NotFoundView from "@/views/NotFoundView";
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
      this.$router.replace({name: "home"});
    }

    if (useFlowStore().isSignedIn && !useFlowStore().isInitialized) {
      useHead({title: "Idea | Ideaflower"});
      return <LoadingView />;
    }

    const idea = useFlowStore().getIdea(this.$route.params.id);

    // invalid id
    if (!idea) {
      useHead({title: "Not Found | Ideaflower"});
      return <NotFoundView />;
    }

    // set title if this is the first time the idea was loaded
    if (!this.idea) {
      useHead({title: (idea.name ? idea.name : "Unwatered Idea") + " | Ideaflower"});
    }

    this.idea = idea;

    if (this.idea.result) {
      this.idea.read = true;
    }

    if (useFlowStore().canGrowIdea) {
      useFlowStore().requestIdeaGrowth();
    }

    return (
      <DetailView
        idea={this.idea}
        isPlantBeingWatered={this.idea.epoch === useFlowStore().plantBeingWateredEpoch}
        waterProgress={useFlowStore().waterProgress}
        isLoading={isPromiseLoading(useFlowStore().chatPromiseState)}
        onDeleteIdea={onDeleteIdeaACB.bind(this)}
      />
    );
  }
};

export default DetailPresenter;
