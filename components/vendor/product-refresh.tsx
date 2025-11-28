// product-refresh.ts
let externalRefresh: (() => void) | null = null;

/**
 * Call this from any component to trigger the product list to refresh.
 */
export function triggerProductListingsRefresh() {
  externalRefresh?.();
}

/**
 * Set the refresh callback. Should be called once in the main product page.
 * @param fn function to trigger a refresh in the main product page
 */
export function setExternalRefresh(fn: () => void) {
  externalRefresh = fn;
}
