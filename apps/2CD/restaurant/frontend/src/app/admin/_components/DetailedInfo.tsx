import { useGetAllOrderQuery } from '@/generated';

export const DetailedInfo = () => {
  const { data, loading, error } = useGetAllOrderQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading</div>;

  const order = data?.getAllOrder;

  return (
    <div className="">
      {order?.slice(0, 1).map((order, index) => {
        const orderNumber = order.orderNumber?.toLocaleString();
        const tableNumber = order.tableNumber?.toUpperCase();
        const totalPrice = order.orderPrice?.toLocaleString();

        return (
          <div key={order.orderNumber ?? index}>
            <div>Order Number: {orderNumber}</div>
            <div>Table Number: {tableNumber}</div>
            <div>{totalPrice}</div>
          </div>
        );
      })}
    </div>
  );
};
