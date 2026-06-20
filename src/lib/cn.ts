// Class-name utility — `clsx` for conditional class assembly,
// `tailwind-merge` to dedupe conflicting Tailwind utilities so
// last-wins works correctly (`px-2 px-4` → `px-4`).
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
