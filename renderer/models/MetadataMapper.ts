export type Option = { key: string; text: string };
export type DependencyOption = Option & { description: string };
export type DependencyGroup = { name: string; values: DependencyOption[] };

export type MetadataModel = {
  lists: {
    project: Option[];
    language: Option[];
    boot: Option[];
    dependencies: DependencyOption[];
    dependencyGroups: DependencyGroup[];
    meta: {
      packaging: Option[];
      java: Option[];
      configurationFileFormat: Option[];
    };
  };
  defaultValues: {
    project: string;
    language: string;
    boot: string;
    meta: {
      name: string;
      group: string;
      artifact: string;
      packageName: string;
      packaging: string;
      java: string;
      configurationFileFormat: string;
    };
  };
};

type RawStartMetadata = {
  type?: { default?: string; values?: Array<{ id: string; name: string; action?: string }> };
  language?: { default?: string; values?: Array<{ id: string; name: string }> };
  bootVersion?: { default?: string; values?: Array<{ id: string; name: string }> };
  dependencies?: {
    values?: Array<{
      name?: string;
      values?: Array<{ id: string; name: string; description?: string }>;
    }>;
  };
  packaging?: { default?: string; values?: Array<{ id: string; name: string }> };
  javaVersion?: { default?: string; values?: Array<{ id: string; name: string }> };
  configurationFileFormat?: { default?: string; values?: Array<{ id: string; name: string }> };
  groupId?: { default?: string };
  name?: { default?: string };
  artifactId?: { default?: string };
  packageName?: { default?: string };
};

export class MetadataMapper {
  static fallback(): MetadataModel {
    return {
      lists: {
        project: [
          { key: "maven-project", text: "Maven" },
          { key: "gradle-project", text: "Gradle" },
        ],
        language: [
          { key: "java", text: "Java" },
          { key: "kotlin", text: "Kotlin" },
          { key: "groovy", text: "Groovy" },
        ],
        boot: [
          { key: "3.4.4", text: "3.4.4" },
          { key: "3.3.10", text: "3.3.10" },
        ],
        dependencies: [
          {
            key: "web",
            text: "Spring Web",
            description: "Build web, including RESTful applications",
          },
          {
            key: "data-jpa",
            text: "Spring Data JPA",
            description: "Persist data in SQL stores with Java Persistence API",
          },
          {
            key: "validation",
            text: "Validation",
            description: "Bean Validation with Hibernate validator",
          },
        ],
        dependencyGroups: [
          {
            name: "Core",
            values: [
              {
                key: "web",
                text: "Spring Web",
                description: "Build web, including RESTful applications",
              },
              {
                key: "data-jpa",
                text: "Spring Data JPA",
                description: "Persist data in SQL stores with Java Persistence API",
              },
              {
                key: "validation",
                text: "Validation",
                description: "Bean Validation with Hibernate validator",
              },
            ],
          },
        ],
        meta: {
          packaging: [
            { key: "jar", text: "Jar" },
            { key: "war", text: "War" },
          ],
          java: [
            { key: "21", text: "21" },
            { key: "17", text: "17" },
          ],
          configurationFileFormat: [
            { key: "properties", text: "Properties" },
            { key: "yaml", text: "YAML" },
          ],
        },
      },
      defaultValues: {
        project: "maven-project",
        language: "java",
        boot: "3.4.4",
        meta: {
          name: "demo",
          group: "com.example",
          artifact: "demo",
          packageName: "com.example.demo",
          packaging: "jar",
          java: "21",
          configurationFileFormat: "properties",
        },
      },
    };
  }

  static toViewModel(raw: RawStartMetadata): MetadataModel {
    const dependencyGroups: DependencyGroup[] = (raw?.dependencies?.values ?? [])
      .map((group) => ({
        name: group.name ?? "Dependencies",
        values: (group.values ?? []).map((item) => ({
          key: item.id,
          text: item.name,
          description: item.description ?? "",
        })),
      }))
      .filter((group) => group.values.length > 0);

    const model = {
      lists: {
        project: (raw?.type?.values ?? [])
          .filter((item) => item.action === "/starter.zip")
          .map((item) => ({ key: item.id, text: item.name })),
        language: (raw?.language?.values ?? []).map((item) => ({
          key: item.id,
          text: item.name,
        })),
        boot: (raw?.bootVersion?.values ?? []).map((item) => ({
          key: item.id,
          text: item.name,
        })),
        dependencies: dependencyGroups.flatMap((group) => group.values),
        dependencyGroups,
        meta: {
          packaging: (raw?.packaging?.values ?? []).map((item) => ({
            key: item.id,
            text: item.name,
          })),
          java: (raw?.javaVersion?.values ?? []).map((item) => ({
            key: item.id,
            text: item.name,
          })),
          configurationFileFormat: (raw?.configurationFileFormat?.values ?? []).map((item) => ({
            key: item.id,
            text: item.name,
          })),
        },
      },
      defaultValues: {
        project: raw?.type?.default ?? "",
        language: raw?.language?.default ?? "",
        boot: raw?.bootVersion?.default ?? "",
        meta: {
          name: raw?.name?.default ?? "",
          group: raw?.groupId?.default ?? "",
          artifact: raw?.artifactId?.default ?? "",
          packageName: raw?.packageName?.default ?? "",
          packaging: raw?.packaging?.default ?? "",
          java: raw?.javaVersion?.default ?? "",
          configurationFileFormat: raw?.configurationFileFormat?.default ?? "",
        },
      },
    };
    if (!model.lists.project.length || !model.lists.language.length || !model.lists.boot.length) {
      return MetadataMapper.fallback();
    }
    return model;
  }
}
