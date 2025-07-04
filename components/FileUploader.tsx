"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));

          return toast(
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is to large,
              Max size is 50MB
            </p>,
            {
              className: "error-toast",
            }
          );
        }

        return uploadFile({ ownerId, accountId, file, path }).then(
          (uplodedFiles) => {
            if (uplodedFiles) {
              setFiles((prev) => prev.filter((f) => f.name !== file.name));
              toast.success("File uploaded successfully", {
                className: "success-toast",
              });
            } else {
              toast.error("Failed to upload file", {
                className: "error-toast",
              });
            }
          }
        );
      });
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const [files, setFiles] = useState<File[]>([]);

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((item) => item.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="icon"
          width={44}
          height={44}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3 truncate">
                  <Thumbnail
                    extension={extension}
                    type={type}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="laoder"
                      width={100}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src="assets/icons/remove.svg"
                  alt="cancel icon"
                  width={24}
                  height={24}
                  onClick={(e) => {
                    handleRemoveFile(e, file.name);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
