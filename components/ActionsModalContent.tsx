import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDatteTime from "./FormattedDatteTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";

const ImageThumbNail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <div className="subtitle-2">{file.name}</div>
      <FormattedDatteTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailsRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex text-left">
    <p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbNail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailsRow label="Format:" value={file.extension} />
        <DetailsRow label="Size:" value={convertFileSize(file.size)} />
        <DetailsRow label="Owner:" value={file.owner.fullName} />
        <DetailsRow label="Last Edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};
export const DeleteFile = ({ file }: { file: Models.Document }) => {
  return <div>Delete Details</div>;
};
export const Share = ({ file }: { file: Models.Document }) => {
  return <div>Add Users</div>;
};
