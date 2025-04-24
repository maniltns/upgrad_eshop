export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home',
  'Sports',
  'Beauty',
  'Toys',
  'Furniture',
  'Food',
  'Others'
]; 