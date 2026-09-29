interface GDGLogoProps {
  className?: string;
  size?: number;
}

export function GDGLogo({ className = "w-9 h-9", size }: GDGLogoProps) {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <img
      src="/gdg-logo.png"
      alt="Google Developer Groups"
      style={style}
      className={`object-contain inline-block shrink-0 ${className}`}
      loading="eager"
    />
  );
}
