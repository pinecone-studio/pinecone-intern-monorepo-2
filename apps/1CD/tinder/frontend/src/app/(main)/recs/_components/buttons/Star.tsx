export const StarIcon = ({isActive}:{isActive:boolean}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false" role="img" strokeWidth="1.7" stroke="#1a75ff">
      <g className={` group-active:fill-black ${isActive ? 'fill-white':'fill-[#33ccff]'}`}>
        <path d="M11.27.948a.82.82 0 0 1 1.46 0l3.138 6.481c.122.243.36.41.632.442l6.784.807c.688.083.963.923.453 1.387l-5.331 4.853a.796.796 0 0 0-.243.763l1.535 6.841c.145.649-.526 1.18-1.137.902L12.34 20a.825.825 0 0 0-.683 0L5.44 23.424c-.611.279-1.282-.253-1.137-.902l1.535-6.841a.796.796 0 0 0-.243-.763L.263 10.065C-.247 9.6.028 8.76.716 8.678L7.5 7.871a.815.815 0 0 0 .632-.442z"></path>
      </g>
    </svg>
  );
};
