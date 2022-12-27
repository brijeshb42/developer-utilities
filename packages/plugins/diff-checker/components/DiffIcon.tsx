import { ComponentProps } from "react";

export function DiffIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width="200px"
      height="200px"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      stroke="#000000"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
      <g id="SVGRepo_iconCarrier">
        <title>file_type_diff</title>
        <rect x="6.975" y="3" width="18.05" height="6.017" fill="#c00000" />
        <path
          d="M12.992,10.95v6.017H6.975v6.017h6.017V29h6.017V22.983h6.017V16.967H19.008V10.95Z"
          fill="green"
        />
      </g>
    </svg>
  );
}
