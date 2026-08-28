import { useVault } from "../hooks/useVault";

function vaultName(path: string) {
  return path.split("/").filter(Boolean).pop() ?? path;
}

interface WelcomeScreenProps {
  onVaultReady: (path: string) => void;
}

export function WelcomeScreen({ onVaultReady }: WelcomeScreenProps) {
  const { recentVaults, loading, chooseVault, openRecentVault } = useVault();

  const handleChoose = async () => {
    await chooseVault();
  };

  const handleRecent = async (path: string) => {
    await openRecentVault(path);
    onVaultReady(path);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-neutral-500">
        Cargando...
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full text-center px-6">
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">📓</span>
        </div>
        <h1 className="text-lg font-medium text-neutral-900 mb-1">
          Bienvenido a Vaulty
        </h1>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          Elige una carpeta para guardar tus notas. Puede ser local o una
          carpeta sincronizada en la nube.
        </p>

        <button
          onClick={handleChoose}
          className="w-full h-11 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition text-sm font-medium mb-3"
        >
          Elegir carpeta del vault
        </button>

        {recentVaults.length > 0 && (
          <div className="border-t border-neutral-200 mt-6 pt-4">
            <p className="text-xs text-neutral-400 mb-2">Vaults recientes</p>
            <div className="space-y-2">
              {recentVaults.map((path) => (
                <button
                  key={path}
                  onClick={() => handleRecent(path)}
                  className="w-full flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded-lg text-left hover:bg-neutral-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">
                      {vaultName(path)}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{path}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
