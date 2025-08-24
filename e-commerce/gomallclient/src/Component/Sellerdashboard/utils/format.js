export const formatCurrency = (amount) => {
  if (typeof amount === 'number') {
    return amount.toLocaleString();
  }
  return Number(amount || 0).toLocaleString();
};

export const formatCurrencyWithSymbol = (amount) => {
  return `${formatCurrency(amount)}₫`;
};

export const slugify = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-');
};

export const generateSKU = (prefix = 'SKU') => {
  return `${prefix}-${Date.now()}`;
};

export const generateLocalId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
};
