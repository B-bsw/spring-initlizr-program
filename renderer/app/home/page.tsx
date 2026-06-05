"use client";

import { useMemo, useState } from "react";
import { ThemeStyle } from "../../models/ThemeStyle";
import useHomeState from "../../hooks/useHomeState";
import HeaderSection from "../../components/sections/HeaderSection";
import FormSection from "../../components/sections/FormSection";
import DependencySection from "../../components/sections/DependencySection";
import FooterSection from "../../components/sections/FooterSection";
import { Toast, toast } from "@heroui/react";
import { useTheme } from "next-themes";
import ZipStructureModal from "../../components/ui/ZipStructureModal";

const isPreviewableFile = (filePath: string) => {
  const fileName = filePath.split("/").pop() ?? "";
  if (fileName.toLowerCase().startsWith(".git")) {
    return true;
  }
  if (
    fileName.toLowerCase().endsWith(".bat") ||
    fileName.toLowerCase().endsWith(".jar")
  ) {
    return false;
  }
  const extensionIndex = fileName.lastIndexOf(".");
  return extensionIndex > 0 && extensionIndex < fileName.length - 1;
};

export default function HomePage() {
  const { state, actions, computed } = useHomeState();
  const style = useMemo(() => new ThemeStyle(state.theme), [state.theme]);
  const [generating, setGenerating] = useState(false);
  const [exploring, setExploring] = useState(false);
  const [zipData, setZipData] = useState<number[] | null>(null);
  const [zipEntries, setZipEntries] = useState<string[]>([]);
  const [zipFileContents, setZipFileContents] = useState<
    Record<string, string>
  >({});
  const [selectedZipFile, setSelectedZipFile] = useState<string>("");
  const [loadingZipFilePath, setLoadingZipFilePath] = useState<string | null>(
    null,
  );
  const [showZipModal, setShowZipModal] = useState(false);
  const { setTheme } = useTheme();

  const fetchStarterZip = async () => {
    return window.ipc.invoke<
      number[],
      {
        type: string;
        language: string;
        bootVersion: string;
        baseDir: string;
        groupId: string;
        artifactId: string;
        packageName: string;
        packaging: string;
        javaVersion: string;
        configurationFileFormat: string;
        dependencies: string[];
      }
    >("project:starter-zip", {
      type: state.project,
      language: state.language,
      bootVersion: state.boot,
      baseDir: state.name,
      groupId: state.group,
      artifactId: state.artifact,
      packageName: state.packageName,
      packaging: state.packaging,
      javaVersion: state.java,
      configurationFileFormat: state.configFormat,
      dependencies: state.selectedDependencies,
    });
  };

  const handleExplore = async () => {
    try {
      if (!state.name) {
        toast.warning("Please include your Project name.");
        return;
      }
      setExploring(true);
      const bytes = await fetchStarterZip();
      const entries = await window.ipc.invoke<string[], { zipData: number[] }>(
        "project:zip-entries",
        {
          zipData: bytes,
        },
      );
      const firstFile =
        entries.find(
          (entry) => !entry.endsWith("/") && isPreviewableFile(entry),
        ) ?? "";
      let firstFileContent = "";
      if (firstFile) {
        setLoadingZipFilePath(firstFile);
        firstFileContent = await window.ipc.invoke<
          string,
          { zipData: number[]; filePath: string }
        >("project:zip-file-content", { zipData: bytes, filePath: firstFile });
      }
      setZipData(bytes);
      setZipEntries(entries);
      setSelectedZipFile(firstFile);
      setZipFileContents(firstFile ? { [firstFile]: firstFileContent } : {});
      setShowZipModal(true);
      // toast.success("Explore preview is ready.");
    } finally {
      setLoadingZipFilePath(null);
      setExploring(false);
    }
  };

  const handleSelectZipFile = async (filePath: string) => {
    if (!zipData) {
      return;
    }
    setSelectedZipFile(filePath);
    if (zipFileContents[filePath] !== undefined) {
      return;
    }
    try {
      setLoadingZipFilePath(filePath);
      const content = await window.ipc.invoke<
        string,
        { zipData: number[]; filePath: string }
      >("project:zip-file-content", { zipData, filePath });
      setZipFileContents((prev) => ({ ...prev, [filePath]: content }));
    } finally {
      setLoadingZipFilePath(null);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      if (!state.outputLocation) {
        // throw new Error("Please select output location");
        toast.warning("Please select output location.");
        return;
      }
      if (!state.name) {
        toast.warning("Please include your Project name.");
        return;
      }
      const bytes = await fetchStarterZip();
      await window.ipc.invoke<
        { path: string },
        { zipData: number[]; outputLocation: string; projectName: string; ide: string }
      >("project:generate", {
        zipData: bytes,
        outputLocation: state.outputLocation,
        projectName: state.name,
        ide: state.ide,
      });
      toast.success("project generated and opened in IDE");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className={`flex h-screen overflow-hidden ${style.bg} ${style.text}`}>
      <Toast.Provider placement="bottom end" className="z-100 **:rounded-md" />
      <ZipStructureModal
        open={showZipModal}
        entries={zipEntries}
        selectedFile={selectedZipFile}
        loadingFilePath={loadingZipFilePath}
        fileContents={zipFileContents}
        onSelectFile={handleSelectZipFile}
        onClose={() => setShowZipModal(false)}
      />

      <section className="hide-scrollbar mx-auto h-screen w-full max-w-4xl max-xl:max-w-2xl overflow-y-auto px-6 pb-24">
        <HeaderSection
          theme={state.theme}
          onThemeChange={(newTheme) => {
            setTheme(newTheme);
            actions.setTheme(newTheme);
          }}
        />
        {state.loading ? (
          <div className="text-sm opacity-70">Loading metadata…</div>
        ) : state.error || !state.metadata ? (
          <div className="text-sm text-red-500">
            {state.error ?? "Metadata unavailable"}
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row">
            <FormSection
              theme={state.theme}
              metadata={state.metadata}
              project={state.project}
              name={state.name}
              language={state.language}
              boot={state.boot}
              group={state.group}
              artifact={state.artifact}
              packageName={state.packageName}
              packaging={state.packaging}
              java={state.java}
              configFormat={state.configFormat}
              outputLocation={state.outputLocation}
              outputLocationDisplay={computed.outputLocationDisplay}
              onProject={actions.setProject}
              onName={actions.setName}
              onLanguage={actions.setLanguage}
              onBoot={actions.setBoot}
              onGroup={actions.setGroup}
              onArtifact={actions.setArtifact}
              onPackageName={actions.setPackageName}
              onPackaging={actions.setPackaging}
              onJava={actions.setJava}
              onConfigFormat={actions.setConfigFormat}
              onPickOutputLocation={actions.pickOutputLocation}
            />
            <DependencySection
              theme={state.theme}
              dependencies={state.metadata.lists.dependencies}
              dependencyGroups={state.metadata.lists.dependencyGroups}
              boot={state.boot}
              selectedDependencies={state.selectedDependencies}
              onSelectedDependenciesChange={actions.setSelectedDependencies}
            />
          </div>
        )}
        <FooterSection
          className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full"
          theme={state.theme}
          generating={generating}
          exploring={exploring}
          onGenerate={handleGenerate}
          onExplore={handleExplore}
        />
      </section>
    </main>
  );
}
