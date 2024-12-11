import { useGetAllUsersQuery } from '@/generated';

const EmployeeList = () => {
  const { data, loading, error } = useGetAllUsersQuery();

  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p>Алдаа гарлаа: {error.message} </p>;

  return (
    <div>
      {data?.getAllUsers?.map((employee) => (
        <div key={employee?._id}>{employee?.userName}</div>
      ))}
    </div>
  );
};

export default EmployeeList;
