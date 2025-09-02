import Contentcontainer from '@/components/admin/Contentcontainer';
import Tablecontainer from '@/components/admin/Tablecontainer';

export const dynamic = 'force-dynamic';

const AdminPage = () => {
  return (
    <div>
      <Contentcontainer />
      <Tablecontainer />
    </div>
  );
};

export default AdminPage;
