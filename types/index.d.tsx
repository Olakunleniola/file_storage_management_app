/* eslint-disable @typescript-eslint/no-unused-vars */

// Add SegmentParams type definition
interface SegmentParams {
  [key: string]: string;
}

interface uploadFileProp {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

interface mobileNavigationProps {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

interface headerProps {
  $id: string;
  accountId: string;
}

type FileType = "document" | "image" | "video" | "audio" | "other";

interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
  action?: string
}
interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

interface ShareInputProps {
  file: File;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}
