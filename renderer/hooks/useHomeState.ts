"use client";

import { useEffect, useState } from "react";
import { MetadataService } from "../services/MetadataService";
import {
  isBootVersionInRange,
  type MetadataModel,
} from "../models/MetadataMapper";
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
  selectedDependencies: string[];
};

export default function useHomeState() {
  const ipc = typeof window !== "undefined" ? window.ipc : undefined;
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
    selectedDependencies: [],
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
      if (!ipc) {
        if (!mounted) return;
        setState((prev) => ({ ...prev, outputLocation: "", homePath: "" }));
        return;
      }
      const [value, homePath] = await Promise.all([
        ipc.invoke<string>("output-location:get"),
        ipc.invoke<string>("output-location:home"),
      ]);
      if (!mounted) return;
      setState((prev) => ({ ...prev, outputLocation: value, homePath }));
    };
    loadOutputLocation();
    return () => {
      mounted = false;
    };
  }, [ipc]);

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
  const setBoot = (boot: string) =>
    setState((prev) => {
      if (!prev.metadata) {
        return { ...prev, boot };
      }
      const allowedDependencyKeys = new Set(
        prev.metadata.lists.dependencies
          .filter((dependency) =>
            isBootVersionInRange(boot, dependency.versionRange),
          )
          .map((dependency) => dependency.key),
      );
      const selectedDependencies = prev.selectedDependencies.filter((key) =>
        allowedDependencyKeys.has(key),
      );
      return { ...prev, boot, selectedDependencies };
    });
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
  const setSelectedDependencies = (selectedDependencies: string[]) =>
    setState((prev) => {
      if (!prev.metadata) {
        return { ...prev, selectedDependencies };
      }
      const dependencyMap = new Map(
        prev.metadata.lists.dependencies.map((dependency) => [
          dependency.key,
          dependency,
        ]),
      );
      const compatibleSelectedDependencies = selectedDependencies.filter(
        (key) => {
          const dependency = dependencyMap.get(key);
          return (
            dependency &&
            isBootVersionInRange(prev.boot, dependency.versionRange)
          );
        },
      );
      return { ...prev, selectedDependencies: compatibleSelectedDependencies };
    });
  const saveOutputLocation = (outputLocation: string) => {
    setOutputLocation(outputLocation);
    ipc?.send("output-location:set", outputLocation);
  };
  const pickOutputLocation = async () => {
    if (!ipc) {
      return;
    }
    const selected = await ipc.invoke<string | null>("output-location:pick");
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
      setSelectedDependencies,
    },
    computed: {
      outputLocationDisplay,
    },
  };
}
