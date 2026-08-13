/**
 * Input sanitisation helpers shared by the modals, the persistence layer and
 * anything that renders user-supplied values.
 */

const ALLOWED_IMAGE_PROTOCOLS = ['http:', 'https:'];

export const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23d1d5db%22/%3E%3C/svg%3E';

/**
 * Only allow absolute http(s) image URLs. Anything else (javascript:, data:,
 * blob:, relative paths that could be rewritten) collapses to a neutral
 * placeholder so it can never be used as an injection or exfiltration vector.
 * @param {unknown} url
 * @returns {string}
 */
export function sanitizeImageUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return FALLBACK_IMAGE;
  try {
    const parsed = new URL(url.trim());
    return ALLOWED_IMAGE_PROTOCOLS.includes(parsed.protocol) ? parsed.toString() : FALLBACK_IMAGE;
  } catch {
    return FALLBACK_IMAGE;
  }
}

/**
 * Trim, strip control characters and cap the length of a free-text field.
 * @param {unknown} value
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeText(value, maxLength = 120) {
  if (value === null || value === undefined) return '';
  /* eslint-disable-next-line no-control-regex */
  return String(value).replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

/**
 * Coerce to a finite number inside [min, max], falling back to `fallback`.
 * @param {unknown} value
 * @param {{min?: number, max?: number, fallback?: number, integer?: boolean}} [options]
 * @returns {number}
 */
export function sanitizeNumber(value, options = {}) {
  const { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0, integer = false } = options;
  const num = integer ? parseInt(value, 10) : parseFloat(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(Math.max(num, min), max);
}

const PRODUCT_CATEGORIES = ['Electronics', 'Computers', 'Home & Living', 'Fashion'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export { PRODUCT_CATEGORIES, ORDER_STATUSES };

/**
 * Normalise a product coming from a form or from persisted storage.
 * @param {Record<string, unknown>} product
 * @returns {Record<string, unknown> | null}
 */
export function sanitizeProduct(product) {
  if (!product || typeof product !== 'object') return null;
  const name = sanitizeText(product.name);
  if (!name) return null;
  const stock = sanitizeNumber(product.stock, { integer: true, max: 1_000_000 });
  const minStockLevel = sanitizeNumber(product.minStockLevel, { integer: true, max: 1_000_000, fallback: 10 });
  return {
    id: sanitizeText(product.id, 40),
    name,
    category: PRODUCT_CATEGORIES.includes(product.category) ? product.category : PRODUCT_CATEGORIES[0],
    price: sanitizeNumber(product.price, { max: 1_000_000 }),
    cost: sanitizeNumber(product.cost, { max: 1_000_000 }),
    stock,
    minStockLevel,
    sku: sanitizeText(product.sku, 40),
    status: stock <= 0 ? 'Out of Stock' : (stock <= minStockLevel ? 'Low Stock' : 'In Stock'),
    rating: sanitizeNumber(product.rating, { max: 5, fallback: 5 }),
    salesCount: sanitizeNumber(product.salesCount, { integer: true, max: 10_000_000 }),
    image: sanitizeImageUrl(product.image),
  };
}

/**
 * Normalise an order coming from persisted storage.
 * @param {Record<string, unknown>} order
 * @returns {Record<string, unknown> | null}
 */
export function sanitizeOrder(order) {
  if (!order || typeof order !== 'object') return null;
  const id = sanitizeText(order.id, 40);
  if (!id) return null;
  const items = Array.isArray(order.items)
    ? order.items.slice(0, 100).map(item => ({
        name: sanitizeText(item?.name),
        quantity: sanitizeNumber(item?.quantity, { integer: true, max: 100_000, fallback: 1 }),
        price: sanitizeNumber(item?.price, { max: 1_000_000 }),
      }))
    : [];
  return {
    id,
    customer: sanitizeText(order.customer),
    email: sanitizeText(order.email, 254),
    date: sanitizeText(order.date, 40),
    status: ORDER_STATUSES.includes(order.status) ? order.status : 'Pending',
    total: sanitizeNumber(order.total, { max: 100_000_000 }),
    items,
    itemsCount: sanitizeNumber(order.itemsCount, { integer: true, max: 100_000, fallback: items.length }),
    shippingAddress: sanitizeText(order.shippingAddress, 240),
    paymentMethod: sanitizeText(order.paymentMethod, 60),
  };
}
