export const calculateTotalAmount = (ticketType: { unitPrice: string; soldQuantity: string }[]) => {
  let total = 0;
  for (let i = 0; i < ticketType.length; i++) {
    const a = Number(ticketType[i].unitPrice) * Number(ticketType[i].soldQuantity);
    total = total + a;
  }
  return total;
};
