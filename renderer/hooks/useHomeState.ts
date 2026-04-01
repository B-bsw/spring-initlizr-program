"use client";

import { useEffect, useState } from "react";
import { MetadataService } from "../services/MetadataService";
import type { MetadataModel } from "../models/MetadataMapper";
import type { Theme } from "../types/types";

export type HomeState = {
  theme: Theme;
  metadata: MetadataModel | null;
  loading: boolean;
  error: string | null;
  project: string;
  language: string;
  boot: string;
  group: string;
  artifact: string;
  packageName: string;
  packaging: string;
  java: string;
  configFormat: string;
};

export default function useHomeState() {
  const [state, setState] = useState<HomeState>({
    theme: "light",
    metadata: null,
    loading: true,
    error: null,
    project: "",
    language: "",
    boot: "",
    group: "",
    artifact: "",
    packageName: "",
    packaging: "",
    java: "",
    configFormat: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const metadata = await MetadataService.getMetadata();
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          metadata,
          loading: false,
          error: null,
          project: metadata.defaultValues.project,
          language: metadata.defaultValues.language,
          boot: metadata.defaultValues.boot,
          group: metadata.defaultValues.meta.group,
          artifact: metadata.defaultValues.meta.artifact,
          packageName: metadata.defaultValues.meta.packageName,
          packaging: metadata.defaultValues.meta.packaging,
          java: metadata.defaultValues.meta.java,
          configFormat: metadata.defaultValues.meta.configurationFileFormat,
        }));
      } catch (e) {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          metadata: prev.metadata,
          loading: false,
          error: e instanceof Error ? e.message : "Cannot load metadata",
        }));
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      packageName: [prev.group, prev.artifact].filter(Boolean).join("."),
    }));
  }, [state.group, state.artifact]);

  const setTheme = (theme: Theme) => setState((prev) => ({ ...prev, theme }));
  const setProject = (project: string) =>
    setState((prev) => ({ ...prev, project }));
  const setLanguage = (language: string) =>
    setState((prev) => ({ ...prev, language }));
  const setBoot = (boot: string) => setState((prev) => ({ ...prev, boot }));
  const setGroup = (group: string) => setState((prev) => ({ ...prev, group }));
  const setArtifact = (artifact: string) =>
    setState((prev) => ({ ...prev, artifact }));
  const setPackageName = (packageName: string) =>
    setState((prev) => ({ ...prev, packageName }));
  const setPackaging = (packaging: string) =>
    setState((prev) => ({ ...prev, packaging }));
  const setJava = (java: string) => setState((prev) => ({ ...prev, java }));
  const setConfigFormat = (configFormat: string) =>
    setState((prev) => ({ ...prev, configFormat }));

  return {
    state,
    actions: {
      setTheme,
      setProject,
      setLanguage,
      setBoot,
      setGroup,
      setArtifact,
      setPackageName,
      setPackaging,
      setJava,
      setConfigFormat,
    },
  };
}
