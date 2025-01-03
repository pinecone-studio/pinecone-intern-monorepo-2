function toMNT(amount: number): string {
  return `${amount.toLocaleString('en-US').replace(/,/g, "'")}₮`;
}

export default toMNT;
