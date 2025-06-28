import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  extension: string;
  url: string;
  type: string;
  imageClassName?: string;
  className?: string;
}

const Thumbnail = ({
  extension,
  url = "",
  type,
  className,
  imageClassName,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      />
    </figure>
  );
};

export default Thumbnail;
