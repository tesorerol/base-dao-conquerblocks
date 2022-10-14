import Navbar from "./Components/Navbar/Navbar";
import Navigation from "./Components/Navigation/Navigation";
import WallectConnect from "./Provider/WalletConnect";

function App() {
  return (
    <WallectConnect>
      <Navbar />
      <Navigation />
    </WallectConnect>
  );
}

export default App;
