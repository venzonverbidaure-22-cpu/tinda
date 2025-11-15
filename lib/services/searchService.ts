import { db } from '@/src/db/drizzle';
import { stalls, stallItems, images } from '@/src/db/schema'; // Adjust to your schema path
import { sql, or, like, eq, and, desc } from 'drizzle-orm';
import { SearchResult } from '@/lib/search';

export class SearchService {
  private cache: Map<string, { results: SearchResult[]; timestamp: number }>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new Map();
  }

  async searchAll(query: string, includeOutOfStock: boolean = false): Promise<SearchResult[]> {
    if (query.length < 2) return [];

    const cacheKey = `${query}:${includeOutOfStock}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.results;
    }

    try {
      const [stallResults, itemResults] = await Promise.all([
        this.searchStalls(query),
        this.searchItems(query, includeOutOfStock),
      ]);

      const results = [...stallResults, ...itemResults]
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 10);

      this.cache.set(cacheKey, { results, timestamp: Date.now() });
      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  private async searchStalls(query: string): Promise<SearchResult[]> {
    const searchTerm = `%${query.toLowerCase()}%`;

    try {
      // Get stalls with images using subquery
      const results = await db
        .select({
          stallId: stalls.stallId,
          stallName: stalls.stallName,
          stallDescription: stalls.stallDescription,
          category: stalls.category,
          imageUrl: images.imageUrl,
        })
        .from(stalls)
        .leftJoin(
          images,
          and(
            eq(images.stallId, stalls.stallId),
            eq(images.imageType, 'profile')
          )
        )
        .where(
          or(
            sql`LOWER(${stalls.stallName}) LIKE ${searchTerm}`,
            sql`LOWER(${stalls.category}) LIKE ${searchTerm}`,
            sql`LOWER(${stalls.stallDescription}) LIKE ${searchTerm}`
          )
        )
        .limit(20);

      // Calculate relevance score
      return results.map((row) => {
        const name = row.stallName.toLowerCase();
        const cat = row.category?.toLowerCase() || '';
        const desc = row.stallDescription?.toLowerCase() || '';
        const q = query.toLowerCase();

        let relevanceScore = 20;
        if (name === q) relevanceScore = 100;
        else if (name.startsWith(q)) relevanceScore = 80;
        else if (name.includes(q)) relevanceScore = 60;
        else if (cat.includes(q)) relevanceScore = 50;
        else if (desc.includes(q)) relevanceScore = 40;

        return {
          id: row.stallId,
          name: row.stallName,
          type: 'stall' as const,
          description: row.stallDescription || undefined,
          category: row.category,
          imageUrl: row.imageUrl || undefined,
          relevanceScore,
        };
      });
    } catch (error) {
      console.error('Search stalls error:', error);
      return [];
    }
  }

  private async searchItems(query: string, includeOutOfStock: boolean): Promise<SearchResult[]> {
    const searchTerm = `%${query.toLowerCase()}%`;

    try {
      const whereConditions = [
        or(
          sql`LOWER(${stallItems.itemName}) LIKE ${searchTerm}`,
          sql`LOWER(${stallItems.itemDescription}) LIKE ${searchTerm}`,
          sql`LOWER(${stalls.stallName}) LIKE ${searchTerm}`
        ),
      ];

      // Add stock filter if needed
      if (!includeOutOfStock) {
        whereConditions.push(eq(stallItems.inStock, true));
      }

      const results = await db
        .select({
          itemId: stallItems.itemId,
          itemName: stallItems.itemName,
          itemDescription: stallItems.itemDescription,
          price: stallItems.price,
          inStock: stallItems.inStock,
          stallName: stalls.stallName,
          category: stalls.category,
          imageUrl: images.imageUrl,
        })
        .from(stallItems)
        .innerJoin(stalls, eq(stalls.stallId, stallItems.stallId))
        .leftJoin(
          images,
          and(
            eq(images.itemId, stallItems.itemId),
            eq(images.imageType, 'product')
          )
        )
        .where(and(...whereConditions))
        .limit(20);

      // Calculate relevance score
      return results.map((row) => {
        const name = row.itemName.toLowerCase();
        const desc = row.itemDescription?.toLowerCase() || '';
        const stallName = row.stallName.toLowerCase();
        const q = query.toLowerCase();

        let relevanceScore = 20;
        if (name === q) relevanceScore = 100;
        else if (name.startsWith(q)) relevanceScore = 80;
        else if (name.includes(q)) relevanceScore = 60;
        else if (desc.includes(q)) relevanceScore = 50;
        else if (stallName.includes(q)) relevanceScore = 40;

        return {
          id: row.itemId,
          name: row.itemName,
          type: 'item' as const,
          description: row.itemDescription || undefined,
          price: row.price ? parseFloat(row.price.toString()) : undefined,
          category: row.category,
          imageUrl: row.imageUrl || undefined,
          stallName: row.stallName,
          inStock: row.inStock || false,
          relevanceScore,
        };
      });
    } catch (error) {
      console.error('Search items error:', error);
      return [];
    }
  }

  async searchByCategory(category: string): Promise<SearchResult[]> {
    try {
      const results = await db
        .select({
          stallId: stalls.stallId,
          stallName: stalls.stallName,
          stallDescription: stalls.stallDescription,
          category: stalls.category,
          imageUrl: images.imageUrl,
        })
        .from(stalls)
        .leftJoin(
          images,
          and(
            eq(images.stallId, stalls.stallId),
            eq(images.imageType, 'profile')
          )
        )
        .where(sql`LOWER(${stalls.category}) = LOWER(${category})`)
        .limit(10);

      return results.map((row) => ({
        id: row.stallId,
        name: row.stallName,
        type: 'stall' as const,
        description: row.stallDescription || undefined,
        category: row.category,
        imageUrl: row.imageUrl || undefined,
      }));
    } catch (error) {
      console.error('Search by category error:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}