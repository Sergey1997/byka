import Image from "next/image";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

function dataUrl(src: string) {
  return src.startsWith("data:");
}

export function Photo({ src, alt, className, sizes, priority, fill, width, height }: PhotoProps) {
  if (!src) return null;
  if (dataUrl(src)) {
    return <img src={src} alt={alt} className={className} width={width} height={height} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes ?? (fill ? "100vw" : undefined)}
      priority={priority}
      quality={70}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
    />
  );
}
