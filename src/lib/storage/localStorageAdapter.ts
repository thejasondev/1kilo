import type { StorageService } from "./types";

export class LocalStorageAdapter<
  T extends { id: string },
> implements StorageService<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  async getAll(): Promise<T[]> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async getById(id: string): Promise<T | null> {
    const all = await this.getAll();
    return all.find((item) => item.id === id) || null;
  }

  async create(item: T): Promise<void> {
    const all = await this.getAll();
    all.push(item);
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  async update(id: string, item: Partial<T>): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex((i) => i.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...item };
      localStorage.setItem(this.key, JSON.stringify(all));
    }
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter((i) => i.id !== id);
    localStorage.setItem(this.key, JSON.stringify(filtered));
  }
}
