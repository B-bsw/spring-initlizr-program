export type Option = { key: string; text: string };

export type Metadata = {
  lists: {
    project: Option[];
    language: Option[];
    boot: Option[];
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
      group: string;
      artifact: string;
      packageName: string;
      packaging: string;
      java: string;
      configurationFileFormat: string;
    };
  };
};

export type Theme = "light" | "dark";
