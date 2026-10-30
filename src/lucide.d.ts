declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  export type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const X: LucideIcon;
  export const Copy: LucideIcon;
  export const Check: LucideIcon;
  export const Send: LucideIcon;
  export const Code: LucideIcon;
  export const Settings: LucideIcon;
  export const FileCode: LucideIcon;
  export const Globe: LucideIcon;
  export const ChevronDown: LucideIcon;
  // Allow any named export
  const exports: { [key: string]: LucideIcon };
  export default exports;
}