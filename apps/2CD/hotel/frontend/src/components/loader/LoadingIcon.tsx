import * as React from "react";

const SvgIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="39"
    height="38"
    fill="none"
    viewBox="0 0 39 38"
    {...props}
  >
    <path
      fill="#2563EB"
      fillOpacity="0.2"
      d="M38.5 19c0 10.493-8.507 19-19 19S.5 29.493.5 19s8.507-19 19-19 19 8.507 19 19M6.2 19c0 7.345 5.955 13.3 13.3 13.3S32.8 26.345 32.8 19 26.845 5.7 19.5 5.7 6.2 11.655 6.2 19"
    ></path>
    <path
      fill="#2563EB"
      d="M19.5 2.85c0-1.574 1.283-2.872 2.84-2.637 2.06.312 4.055.96 5.905 1.92 1.398.724 1.673 2.528.748 3.801s-2.701 1.523-4.142.89a13.3 13.3 0 0 0-2.523-.82C20.79 5.67 19.5 4.424 19.5 2.85"
    ></path>
  </svg>
);

export default SvgIcon;
