import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { MainScreen } from "./components/MainScreen";

function App() {
  const [vaultPath, setVaultPath] = useState<string | null>(null);

  if (!vaultPath) {
    return <WelcomeScreen onVaultReady={setVaultPath} />;
  }

  return (
    <MainScreen vaultPath={vaultPath} onExitVault={() => setVaultPath(null)} />
  );
}

export default App;
