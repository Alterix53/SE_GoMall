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

export const generateSafeId = (serverId = null) => {
  if (serverId) {
    // Try to extract numeric ID from server ID
    const numericPart = serverId.substring(serverId.length - 5);
    const numericId = Number(numericPart);
    
    // If it's a valid number, use it
    if (!isNaN(numericId) && numericId > 0) {
      return numericId;
    }
  }
  
  // Fallback to timestamp + random for uniqueness
  return Date.now() + Math.floor(Math.random() * 1000);
};
