export const LoveIcon = ({isActive}:{isActive:boolean}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false" role="img" strokeWidth="1.7" stroke="#00b33c">
      <g >
        <path
          className={` group-active:fill-black ${isActive ? 'fill-white':'fill-[#4dff4d]'}`}
          d="M24 8.845c0-4.253-2.89-7.34-6.87-7.34-2.134 0-3.283.777-5.128 2.537C10.155 2.279 9.005 1.5 6.871 1.5 2.89 1.5 0 4.587 0 8.84a7.17 7.17 0 0 0 1.839 4.804l9.632 8.659a.817.817 0 0 0 1.063.002l8.686-7.754h.001l.532-.475.199-.208.2-.208A7.168 7.168 0 0 0 24 8.845"
   
        ></path>
      </g>
    </svg>
  );
};
