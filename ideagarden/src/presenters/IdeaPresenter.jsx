import useFlowStore from "@/stores/flowStore";
import IdeaView from "@/views/IdeaView";

const IdeaPresenter = {
  data() {
    return {
    };
  },

  render() {
    const epoch = this.$route.params.id;
    const idea = useFlowStore().getIdea(epoch) || {};

    return (
      <IdeaView
        idea={idea}
        isPlantBeingWatered={idea.epoch === useFlowStore().firstUngrownIdea?.epoch}
        waterProgress={useFlowStore().waterProgress} />
    );
  }
};

export default IdeaPresenter;
