export const DislikeIcon = ({isActive}:{isActive:boolean}) => {
  return (
    
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
       strokeWidth="1.5"
        stroke="#cc0000"
      >
        
        <g >
          <path className={` group-active:fill-black ${isActive ?'fill-white':'fill-[#ff3399]'}`}
            d="m16.526 12 6.896-6.895a1.99 1.99 0 0 0-.005-2.809L21.706.585a1.986 1.986 0 0 0-2.81-.005L12 7.474 5.104.58a1.986 1.986 0 0 0-2.81.005L.583 2.296a1.99 1.99 0 0 0-.005 2.81L7.474 12 .578 18.895a1.99 1.99 0 0 0 .005 2.809l1.711 1.711c.778.778 2.036.78 2.81.006L12 16.526l6.896 6.895a1.986 1.986 0 0 0 2.81-.006l1.711-1.711a1.99 1.99 0 0 0 .005-2.81z"
      
          ></path>
        </g>
      </svg>
   
  );
};
