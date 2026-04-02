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
  name: string;
  language: string;
  boot: string;
  group: string;
  artifact: string;
  packageName: string;
  packaging: string;
  java: string;
  configFormat: string;
  outputLocation: string;
  homePath: string;
};

export default function useHomeState() {
  const [state, setState] = useState<HomeState>({
    theme: "light",
    metadata: null,
    loading: true,
    error: null,
    project: "",
    name: "",
    language: "",
    boot: "",
    group: "",
    artifact: "",
    packageName: "",
    packaging: "",
    java: "",
    configFormat: "",
    outputLocation: "",
    homePath: "",
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
          name: metadata.defaultValues.meta.name,
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
    let mounted = true;
    const loadOutputLocation = async () => {
      const [value, homePath] = await Promise.all([
        window.ipc.invoke<string>("output-location:get"),
        window.ipc.invoke<string>("output-location:home"),
      ]);
      if (!mounted) return;
      setState((prev) => ({ ...prev, outputLocation: value, homePath }));
    };
    loadOutputLocation();
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
  const setName = (name: string) => setState((prev) => ({ ...prev, name }));
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
  const setOutputLocation = (outputLocation: string) =>
    setState((prev) => ({ ...prev, outputLocation }));
  const saveOutputLocation = (outputLocation: string) => {
    setOutputLocation(outputLocation);
    window.ipc.send("output-location:set", outputLocation);
  };
  const pickOutputLocation = async () => {
    const selected = await window.ipc.invoke<string | null>(
      "output-location:pick",
    );
    if (selected) {
      setOutputLocation(selected);
    }
  };
  const outputLocationDisplay =
    state.outputLocation && state.homePath
      ? state.outputLocation.startsWith(state.homePath)
        ? `~${state.outputLocation.slice(state.homePath.length)}`
        : state.outputLocation
      : state.outputLocation;

  return {
    state,
    actions: {
      setTheme,
      setProject,
      setName,
      setLanguage,
      setBoot,
      setGroup,
      setArtifact,
      setPackageName,
      setPackaging,
      setJava,
      setConfigFormat,
      setOutputLocation: saveOutputLocation,
      pickOutputLocation,
    },
    computed: {
      outputLocationDisplay,
    },
  };
}
