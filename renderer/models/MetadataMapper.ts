export type Option = { key: string; text: string };
export type DependencyOption = Option & {
  description: string;
  versionRange?: string;
};
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
      values?: Array<{
        id?: string;
        name?: string;
        description?: string;
        versionRange?: string;
      }>;
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

const toReadableDependencyName = (name: string | undefined, id: string) => {
  const trimmed = name?.trim();
  if (trimmed) {
    return trimmed;
  }
  const fromId = id
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return fromId || id;
};

type ParsedVersion = {
  core: number[];
  prerelease: string[];
};

const parseVersion = (version: string): ParsedVersion => {
  const normalized = version.trim().replace(/^v/i, "");
  const [withoutBuildMetadata] = normalized.split("+", 1);
  const [coreRaw = "", prereleaseRaw] = withoutBuildMetadata.split("-", 2);
  const core = coreRaw
    .split(".")
    .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ""), 10))
    .map((value) => (Number.isNaN(value) ? 0 : value));
  return {
    core: core.length > 0 ? core : [0],
    prerelease: prereleaseRaw
      ? prereleaseRaw
          .split(".")
          .map((part) => part.trim())
          .filter(Boolean)
      : [],
  };
};

const comparePrereleasePart = (left: string, right: string) => {
  const leftNumeric = /^[0-9]+$/.test(left);
  const rightNumeric = /^[0-9]+$/.test(right);
  if (leftNumeric && rightNumeric) {
    const leftValue = Number.parseInt(left, 10);
    const rightValue = Number.parseInt(right, 10);
    if (leftValue < rightValue) {
      return -1;
    }
    if (leftValue > rightValue) {
      return 1;
    }
    return 0;
  }
  if (leftNumeric && !rightNumeric) {
    return -1;
  }
  if (!leftNumeric && rightNumeric) {
    return 1;
  }
  return left.localeCompare(right, undefined, { sensitivity: "base" });
};

const compareVersion = (left: string, right: string) => {
  const leftParsed = parseVersion(left);
  const rightParsed = parseVersion(right);
  const maxLength = Math.max(leftParsed.core.length, rightParsed.core.length);
  for (let index = 0; index < maxLength; index += 1) {
    const leftPart = leftParsed.core[index] ?? 0;
    const rightPart = rightParsed.core[index] ?? 0;
    if (leftPart < rightPart) {
      return -1;
    }
    if (leftPart > rightPart) {
      return 1;
    }
  }

  const leftIsRelease = leftParsed.prerelease.length === 0;
  const rightIsRelease = rightParsed.prerelease.length === 0;
  if (leftIsRelease && rightIsRelease) {
    return 0;
  }
  if (leftIsRelease && !rightIsRelease) {
    return 1;
  }
  if (!leftIsRelease && rightIsRelease) {
    return -1;
  }

  const maxPrereleaseLength = Math.max(
    leftParsed.prerelease.length,
    rightParsed.prerelease.length,
  );
  for (let index = 0; index < maxPrereleaseLength; index += 1) {
    const leftPart = leftParsed.prerelease[index];
    const rightPart = rightParsed.prerelease[index];
    if (leftPart === undefined) {
      return -1;
    }
    if (rightPart === undefined) {
      return 1;
    }
    const comparePart = comparePrereleasePart(leftPart, rightPart);
    if (comparePart !== 0) {
      return comparePart;
    }
  }
  return 0;
};

export const isBootVersionInRange = (bootVersion: string, versionRange?: string) => {
  const range = versionRange?.trim();
  if (!range) {
    return true;
  }
  if (!range.includes(",")) {
    return compareVersion(bootVersion, range) >= 0;
  }
  const isLowerInclusive = range.startsWith("[");
  const isUpperInclusive = range.endsWith("]");
  if (!["[", "("].includes(range.charAt(0)) || !["]", ")"].includes(range.charAt(range.length - 1))) {
    return true;
  }
  const body = range.slice(1, -1);
  const bounds = body.split(",").map((part) => part.trim());
  if (bounds.length < 2) {
    return true;
  }
  const [lowerBoundRaw = "", upperBoundRaw = ""] = bounds;
  const lowerBound = lowerBoundRaw.trim();
  const upperBound = upperBoundRaw.trim();
  if (lowerBound) {
    const compareLower = compareVersion(bootVersion, lowerBound);
    // [A,...) => A <= X, (A,...) => A < X
    if (compareLower < 0 || (compareLower === 0 && !isLowerInclusive)) {
      return false;
    }
  }
  if (upperBound) {
    const compareUpper = compareVersion(bootVersion, upperBound);
    // (...,B] => X <= B, (...,B) => X < B
    if (compareUpper > 0 || (compareUpper === 0 && !isUpperInclusive)) {
      return false;
    }
  }
  return true;
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
      .map((group) => {
        const values = (group.values ?? []).flatMap((item) => {
          const key = item.id?.trim();
          if (!key) {
            return [];
          }
          return [
            {
              key,
              text: toReadableDependencyName(item.name, key),
              description: item.description?.trim() ?? "",
              versionRange: item.versionRange?.trim() || undefined,
            },
          ];
        });
        return {
          name: group.name?.trim() || "Dependencies",
          values,
        };
      })
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
