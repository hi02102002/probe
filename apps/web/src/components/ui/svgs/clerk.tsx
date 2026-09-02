import type { SVGProps } from 'react'

export function Clerk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="64" cy="64" fill="currentColor" r="20" />
      <path
        d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.846 35.846 0 0 0 64 28c-19.882 0-36 16.118-36 36s16.118 36 36 36c6.23 0 12.062-1.583 17.15-4.364 1.66-.908 3.73-.736 5.07.604l13.67 13.67c1.725 1.726 1.536 4.582-.497 5.918A59.88 59.88 0 0 1 64 124C30.863 124 4 97.137 4 64S30.863 4 64 4c12.784 0 24.646 4 34.42 10.788z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  )
}
