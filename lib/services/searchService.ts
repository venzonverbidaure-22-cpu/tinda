import { mockProducts, mockVendors } from '@/lib/mock-data';
import { Product, Vendor } from '@/lib/types';

export class SearchService {
  async searchAll(query: string, includeOutOfStock: boolean = false): Promise<(Product | Vendor)[]> {
    const lowerCaseQuery = query.toLowerCase();

    const filteredProducts = mockProducts.filter(product => {
      const matchesQuery = product.product_name.toLowerCase().includes(lowerCaseQuery) ||
                           product.description.toLowerCase().includes(lowerCaseQuery);
      const inStock = includeOutOfStock || product.stock > 0;
      return matchesQuery && inStock;
    });

    const filteredVendors = mockVendors.filter(vendor => {
      return vendor.stall_name.toLowerCase().includes(lowerCaseQuery) ||
             vendor.stall_description.toLowerCase().includes(lowerCaseQuery);
    });

    return [...filteredProducts, ...filteredVendors];
  }
}
