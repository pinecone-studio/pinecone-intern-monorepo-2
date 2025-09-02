import SidebarTop from './SidebarTop';
import SidebarBottom from './SidebarBottom';

const DashboardSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <SidebarTop />
      <SidebarBottom />
    </div>
  );
};

export default DashboardSidebar;
