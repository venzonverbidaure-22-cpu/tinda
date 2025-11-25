// // lib/adapters.ts

// /**
//  * Convert database cart item to frontend cart item format
//  * This makes your existing frontend code work with the new database schema
//  */
// export function adaptCartItem(dbItem: any): any {
//   return {
//     // Your frontend expects these fields:
//     productId: dbItem.item_id.toString(),
//     vendorId: dbItem.stall_id?.toString() || dbItem.stall?.stall_id?.toString() || '',
//     quantity: dbItem.quantity,
//     price: parseFloat(dbItem.unit_price || dbItem.price || '0'),
    
//     // Keep database fields for new code
//     line_item_id: dbItem.line_item_id,
//     item_id: dbItem.item_id,
//     unit_price: dbItem.unit_price,
//     product: dbItem.product,
//     stall: dbItem.stall
//   };
// }

// /**
//  * Convert frontend cart item to database format for API calls
//  */
// export function toDatabaseCartItem(frontendItem: any): { item_id: number; quantity: number } {
//   return {
//     item_id: parseInt(frontendItem.productId || frontendItem.item_id),
//     quantity: frontendItem.quantity || 1
//   };
// }


