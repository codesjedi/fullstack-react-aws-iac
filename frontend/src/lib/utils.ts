export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('es-ES');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
  }).format(amount);
}