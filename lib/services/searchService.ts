import pool from '@/db';
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

    const searchTerm = `%${query.toLowerCase()}%`;

    try {
      const [stallResults, itemResults] = await Promise.all([
        this.searchStalls(searchTerm),
        this.searchItems(searchTerm, includeOutOfStock),
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

  private async searchStalls(searchTerm: string): Promise<SearchResult[]> {
    const query = `
      SELECT 
        s.stall_id,
        s.stall_name,
        s.stall_description,
        s.category,
        i.image_url,
        CASE 
          WHEN LOWER(s.stall_name) LIKE $1 THEN 100
          WHEN LOWER(s.stall_name) LIKE $2 THEN 80
          WHEN LOWER(s.category) LIKE $1 THEN 60
          WHEN LOWER(s.stall_description) LIKE $1 THEN 40
          ELSE 20
        END as relevance_score
      FROM stalls s
      LEFT JOIN LATERAL (
        SELECT image_url 
        FROM images 
        WHERE stall_id = s.stall_id AND image_type = 'profile' 
        LIMIT 1
      ) i ON true
      WHERE 
        LOWER(s.stall_name) LIKE $1 
        OR LOWER(s.category) LIKE $1 
        OR LOWER(s.stall_description) LIKE $1
      ORDER BY relevance_score DESC
      LIMIT 20
    `;

    const { rows } = await pool.query(query, [searchTerm, `${searchTerm.slice(1, -1)}%`]);

    return rows.map((row) => ({
      id: row.stall_id,
      name: row.stall_name,
      type: 'stall' as const,
      description: row.stall_description,
      category: row.category,
      imageUrl: row.image_url,
      relevanceScore: row.relevance_score,
    }));
  }

  private async searchItems(searchTerm: string, includeOutOfStock: boolean): Promise<SearchResult[]> {
    const inStockCondition = includeOutOfStock ? '' : 'AND si.in_stock = true';

    const query = `
      SELECT 
        si.item_id,
        si.item_name,
        si.item_description,
        si.price,
        si.in_stock,
        s.stall_name,
        s.category,
        i.image_url,
        CASE 
          WHEN LOWER(si.item_name) LIKE $1 THEN 100
          WHEN LOWER(si.item_name) LIKE $2 THEN 80
          WHEN LOWER(si.item_description) LIKE $1 THEN 60
          WHEN LOWER(s.stall_name) LIKE $1 THEN 40
          ELSE 20
        END as relevance_score
      FROM stall_items si
      INNER JOIN stalls s ON s.stall_id = si.stall_id
      LEFT JOIN LATERAL (
        SELECT image_url 
        FROM images 
        WHERE item_id = si.item_id AND image_type = 'product' 
        LIMIT 1
      ) i ON true
      WHERE 
        (LOWER(si.item_name) LIKE $1 
        OR LOWER(si.item_description) LIKE $1
        OR LOWER(s.stall_name) LIKE $1)
        ${inStockCondition}
      ORDER BY relevance_score DESC
      LIMIT 20
    `;

    const { rows } = await pool.query(query, [searchTerm, `${searchTerm.slice(1, -1)}%`]);

    return rows.map((row) => ({
      id: row.item_id,
      name: row.item_name,
      type: 'item' as const,
      description: row.item_description,
      price: parseFloat(row.price),
      category: row.category,
      imageUrl: row.image_url,
      stallName: row.stall_name,
      inStock: row.in_stock,
      relevanceScore: row.relevance_score,
    }));
  }
}

// ============================================
// FILE 4: app/api/search/suggest/route.ts
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/services/searchService';

const searchService = new SearchService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const includeOutOfStock = searchParams.get('includeOutOfStock') === 'true';

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    if (query.length < 2) {
      return NextResponse.json({ results: [], query, count: 0 });
    }

    const results = await searchService.searchAll(query, includeOutOfStock);

    return NextResponse.json({
      results,
      query,
      count: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}