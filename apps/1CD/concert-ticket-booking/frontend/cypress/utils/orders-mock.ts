export const data = {
  getOrder: [
    {
      _id: '676e4e8a57bd55115f8bafce',
      createdAt: '2025-12-27T06:51:54.503Z',
      status: 'pending',
      ticketType: [
        {
          _id: '676b94b6bd529295c8a12efc',
          additional: 'Exclusive merchandise included',
          discount: '10',
          soldQuantity: '3',
          unitPrice: '200000',
          zoneName: 'VIP',
          __typename: 'TicketType',
        },
      ],
      __typename: 'Order',
    },
    {
      _id: '676e59b057bd55115f8bb02c',
      createdAt: '2025-12-27T07:39:28.335Z',
      status: 'approved',
      ticketType: [
        {
          additional: 'Exclusive merchandise included',
          discount: '10',
          soldQuantity: '2',
          unitPrice: '280000',
          zoneName: 'VIP',
          __typename: 'TicketType',
        },
        {
          additional: '',
          discount: '11',
          soldQuantity: '4',
          unitPrice: '140000',
          zoneName: 'Backstage',
          __typename: 'TicketType',
        },
      ],
      __typename: 'Order',
    },
    {
      _id: '67720a5842a9de4bf2a056ca',
      createdAt: '2025-01-03T02:50:00.574Z',
      status: 'available',
      ticketType: [
        {
          additional: 'Exclusive merchandise included',
          discount: '10',
          soldQuantity: '2',
          unitPrice: '280000',
          zoneName: 'VIP',
          __typename: 'TicketType',
        },
        {
          additional: '',
          discount: '11',
          soldQuantity: '4',
          unitPrice: '140000',
          zoneName: 'Backstage',
          __typename: 'TicketType',
        },
        {
          additional: '',
          discount: '11',
          soldQuantity: '4',
          unitPrice: '140000',
          zoneName: 'Regular',
          __typename: 'TicketType',
        },
      ],
      __typename: 'Order',
    },
  ],
};
