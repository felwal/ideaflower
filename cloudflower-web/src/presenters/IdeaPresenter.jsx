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
        idea={idea} />
    );
  }
};

export default IdeaPresenter;
