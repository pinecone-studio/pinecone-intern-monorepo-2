/* eslint-disable @typescript-eslint/no-explicit-any */
export const ticketDocs = (newConcertId: string, createdSchedules: any, ticket: { price: number; type: 'VIP' | 'STANDARD' | 'BACKSEAT'; quantity: number }[]) => {
  const ticketDocs = [];
  console.log(createdSchedules);
  
  for (const schedule of createdSchedules) {
    for (const t of ticket) {
      ticketDocs.push({
        concert: newConcertId,
        schedule: schedule,
        price: t.price,
        type: t.type,
        quantity: t.quantity,
      });
    }
  }
  return ticketDocs;
};
