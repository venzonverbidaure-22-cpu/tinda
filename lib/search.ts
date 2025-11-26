export interface SearchResult {
  id: number;
  name: string;
  type: 'stall' | 'item';
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  stallName?: string;
  inStock?: boolean;
  relevanceScore?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
}