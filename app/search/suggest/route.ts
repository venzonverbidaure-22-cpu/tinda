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
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
