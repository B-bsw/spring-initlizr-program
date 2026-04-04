import { useEffect, useState } from "react";
import type { Metadata } from "../types/types";

export default function useMetadata() {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api-springboot-initializr.vercel.app/api", { method: "GET" });
        if (!response.ok) {
          throw new Error(`Metadata request failed (${response.status})`);
        }
        const json = await response.json();
        const mapped: Metadata = {
          lists: {
            project: (json?.type?.values ?? [])
              .filter(
                (item: { action?: string }) => item.action === "https://api-springboot-initializr.vercel.app/starter.zip",
              )
              .map((item: { id: string; name: string }) => ({
                key: item.id,
                text: item.name,
              })),
            language: (json?.language?.values ?? []).map(
              (item: { id: string; name: string }) => ({
                key: item.id,
                text: item.name,
              }),
            ),
            boot: (json?.bootVersion?.values ?? []).map(
              (item: { id: string; name: string }) => ({
                key: item.id,
                text: item.name,
              }),
            ),
            meta: {
              packaging: (json?.packaging?.values ?? []).map(
                (item: { id: string; name: string }) => ({
                  key: item.id,
                  text: item.name,
                }),
              ),
              java: (json?.javaVersion?.values ?? []).map(
                (item: { id: string; name: string }) => ({
                  key: item.id,
                  text: item.name,
                }),
              ),
              configurationFileFormat: (
                json?.configurationFileFormat?.values ?? []
              ).map((item: { id: string; name: string }) => ({
                key: item.id,
                text: item.name,
              })),
            },
          },
          defaultValues: {
            project: json?.type?.default ?? "",
            language: json?.language?.default ?? "",
            boot: json?.bootVersion?.default ?? "",
            meta: {
              group: json?.groupId?.default ?? "",
              artifact: json?.artifactId?.default ?? "",
              packageName: json?.packageName?.default ?? "",
              packaging: json?.packaging?.default ?? "",
              java: json?.javaVersion?.default ?? "",
              configurationFileFormat:
                json?.configurationFileFormat?.default ?? "",
            },
          },
        };
        if (!mounted) return;
        setMetadata(mapped);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Cannot load metadata");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { metadata, loading, error };
}
