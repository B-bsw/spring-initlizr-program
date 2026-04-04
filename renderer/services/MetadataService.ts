import { MetadataMapper, type MetadataModel } from "../models/MetadataMapper";

export class MetadataService {
  static async getMetadata(): Promise<MetadataModel> {
    try {
      const response = await fetch("https://api-springboot-initializr.vercel.app/api", { method: "GET" });
      if (!response.ok) {
        return MetadataMapper.fallback();
      }
      const raw = await response.json();
      return MetadataMapper.toViewModel(raw);
    } catch {
      return MetadataMapper.fallback();
    }
  }
}
