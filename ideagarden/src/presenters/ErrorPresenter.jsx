import ErrorView from "@/views/ErrorView";

const ErrorPresenter = {
  render() {
    function returnHomeACB() {
      this.$router.push({name: "home"});
    }

    return <ErrorView onReturnHome={returnHomeACB.bind(this)} />;
  },
};

export default ErrorPresenter;
