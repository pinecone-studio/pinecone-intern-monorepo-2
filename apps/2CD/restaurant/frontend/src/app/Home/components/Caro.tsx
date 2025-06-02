import { useQuery, gql } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
const GET_ALL_CATEGORY = gql`
  query GetAllCategory {
    getAllCategory {
      _id
      name
    }
  }
`;

const Caro = () => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-nowrap gap-4 px-2 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {data.getAllCategory.map((item: { _id: string; name: string }) => (
          <div key={item._id} className="flex-shrink-0 w-40 sm:w-48">
            <button type="button" onClick={() => alert(`Clicked on ${item.name}`)} className="w-full focus:outline-none">
              <Card>
                <CardContent className="flex flex-col items-center justify-center px-4 py-2">
                  <span className="text-sm font-medium text-amber-950 leading-tight whitespace-nowrap">{item.name}</span>
                </CardContent>
              </Card>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Caro;
