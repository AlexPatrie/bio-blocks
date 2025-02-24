export type Data = any;

export type Variant = "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark" | "link";

export type StyleConfig = {
  [key: string]: string | number;
};

export type ImageConfig = {
  variant: Variant;
  src: string;
}

export type ButtonConfig = {
  variant: Variant;
  onClick?: (data?: any) => void;
}
