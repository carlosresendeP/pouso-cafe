// Icon shapes copied from the source's inline SVGs.
type P = { className?: string };

/** A paper coffee bag with a folded top and a bean on the label. */
export const CartIcon = ({ className = "h-[26px] w-[26px]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 7.5h12l1.2 13.2a.8.8 0 0 1-.8.8H5.6a.8.8 0 0 1-.8-.8Z" />
    <path d="M6 7.5 7.4 3h9.2L18 7.5" />
    <path d="M9 3.2v2.2M12 3v2.4M15 3.2v2.2" strokeWidth="1" opacity="0.7" />
    <g transform="rotate(-28 12 14.5)">
      <ellipse cx="12" cy="14.5" rx="2.1" ry="2.9" />
      <path d="M12 11.7c-1 2 1 3.6 0 5.6" strokeWidth="1" />
    </g>
  </svg>
);

export const MenuIcon = ({ className = "h-[22px] w-[22px]" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5.5 3.5" className={className}>
    <path d="M3 6h14M3 10h14M3 14h14" />
  </svg>
);

export const CloseIcon = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
    <path d="M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8" />
  </svg>
);

export const TrashIcon = ({ className = "h-4 w-4" }: P) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 4h11M6 4V2.6h4V4M3.8 4l.7 9.4h7l.7-9.4M6.6 6.5v4.6M9.4 6.5v4.6" />
  </svg>
);

const Wa = () => (
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
);
const Ig = () => (
  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
);
const Yt = () => (
  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
);
const Tt = () => (
  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
);

import { contact as footer } from "@/lib/pouso/data";

export const socials = [
  { label: `WhatsApp`, href: `https://wa.me/${footer.whatsapp}`, icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]"><Wa /></svg> },
  { label: `Instagram · @${footer.instagram}`, href: `https://instagram.com/${footer.instagram}`, icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]"><Ig /></svg> },
  { label: `YouTube · @${footer.youtube}`, href: `https://www.youtube.com/@${footer.youtube}`, icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]"><Yt /></svg> },
  { label: `TikTok · @${footer.tiktok}`, href: `https://www.tiktok.com/@${footer.tiktok}`, icon: <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]"><Tt /></svg> },
  {
    label: `E-mail · ${footer.email}`,
    href: `mailto:${footer.email}`,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.05" strokeLinejoin="round" strokeLinecap="round" className="h-[22px] w-[22px]">
        <rect x="1.15" y="2.8" width="21.7" height="18.4" rx="3.3" />
        <path d="M2.4 5 12 13.2l9.6-8.2" />
      </svg>
    ),
  },
];
