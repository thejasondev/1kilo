import { db } from "./db";
import type { StorageService } from "./types";
import type { EntityTable } from "dexie";

// We constrain T to have an id of type string, which matches our Dexie schema definition
export class DexieAdapter<
  T extends { id: string },
> implements StorageService<T> {
  // Use 'any' for the table generic to bypass strict IDType checks for now
  private table: EntityTable<T, "id">;

  constructor(tableName: string) {
    const t = (db as any)[tableName];
    if (!t) {
      throw new Error(`Table ${tableName} not found in Dexie DB`);
    }
    this.table = t as EntityTable<T, "id">;
  }

  async getAll(): Promise<T[]> {
    return await this.table.toArray();
  }

  async getById(id: string): Promise<T | null> {
    const item = await this.table.get(id as any);
    return item || null;
  }

  async create(item: T): Promise<void> {
    await this.table.put(item);
  }

  async update(id: string, item: Partial<T>): Promise<void> {
    // Dexie update needs the key first. 'item' is partial but Dexie types can be strict.
    // Casting item to any works around complex mapped type issues in Dexie 4
    await this.table.update(id as any, item as any);
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id as any);
  }
}
