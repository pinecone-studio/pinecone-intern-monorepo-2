const SidebarBottom = () => {
  return (
    <div className="p-2 border-t flex items-center space-x-2">
      <img src="https://via.placeholder.com/30" className="rounded-full" alt="Admin avatar" />
      <div>
        <div className="text-sm font-semibold text-[#334155]">admin</div>
        <div className="text-xs font-normal text-[#334155] ">admin@pedia.com</div>
      </div>
    </div>
  );
};

export default SidebarBottom;
