import { useState, useEffect, useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import {
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

const CONFIG_FILE = "vaulty-config.json";

interface VaultConfig {
  recentVaults: string[];
  lastVault: string | null;
}

export function useVault() {
  const [vaultPath, setVaultPath] = useState<string | null>(null);
  const [recentVaults, setRecentVaults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar config al iniciar
  useEffect(() => {
    (async () => {
      try {
        const configExists = await exists(CONFIG_FILE, {
          baseDir: BaseDirectory.AppConfig,
        });
        if (configExists) {
          const raw = await readTextFile(CONFIG_FILE, {
            baseDir: BaseDirectory.AppConfig,
          });
          const config: VaultConfig = JSON.parse(raw);
          setRecentVaults(config.recentVaults ?? []);
          if (config.lastVault) setVaultPath(config.lastVault);
        }
      } catch (err) {
        console.error("Error cargando config:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveConfig = useCallback(async (config: VaultConfig) => {
    const dirExists = await exists("", { baseDir: BaseDirectory.AppConfig });
    if (!dirExists) {
      await mkdir("", { baseDir: BaseDirectory.AppConfig, recursive: true });
    }
    await writeTextFile(CONFIG_FILE, JSON.stringify(config, null, 2), {
      baseDir: BaseDirectory.AppConfig,
    });
  }, []);

  const chooseVault = useCallback(async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Elige la carpeta de tu vault",
    });

    if (typeof selected === "string") {
      await invoke("allow_vault_scope", { path: selected });
      setVaultPath(selected);
      const updatedRecent = [
        selected,
        ...recentVaults.filter((v) => v !== selected),
      ].slice(0, 5);
      setRecentVaults(updatedRecent);
      await saveConfig({ recentVaults: updatedRecent, lastVault: selected });
    }
  }, [recentVaults, saveConfig]);

  const openRecentVault = useCallback(
    async (path: string) => {
      await invoke("allow_vault_scope", { path });
      setVaultPath(path);
      await saveConfig({ recentVaults, lastVault: path });
    },
    [recentVaults, saveConfig],
  );

  return { vaultPath, recentVaults, loading, chooseVault, openRecentVault };
}
