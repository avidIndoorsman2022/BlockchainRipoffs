import {
  Footer,
  Loader,
  Navbar,
  ReportResults,
  EnterReport,
  Transactions,
  Welcome,
} from "./components";

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
        <EnterReport />
        <Transactions />
        <Footer />
      </div>
    </div>
  );
};

export default App;
