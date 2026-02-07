import useFlowStore from "@/stores/flowStore";
import IdeaView from "@/views/IdeaView";

const IdeaPresenter = {
  render() {
    const epoch = this.$route.params.id;
    const idea = useFlowStore().getIdea(epoch) || {};

    if (idea.result) {
      idea.read = true;
    }

    return (
      <IdeaView
        idea={idea}
        isPlantBeingWatered={idea.epoch === useFlowStore().firstUngrownIdea?.epoch}
        waterProgress={useFlowStore().waterProgress} />
    );
  }
};

export default IdeaPresenter;
