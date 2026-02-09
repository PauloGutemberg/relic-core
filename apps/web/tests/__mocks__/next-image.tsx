import React from "react";

export default function NextImage(props: any) {
  const {
    src,
    alt,
    fill,
    sizes,
    priority,
    quality,
    loader,
    blurDataURL,
    placeholder,
    unoptimized,
    onLoadingComplete,
    style,
    ...rest
  } = props;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} style={style} {...rest} />;
}
