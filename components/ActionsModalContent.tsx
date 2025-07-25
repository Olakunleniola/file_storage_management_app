import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useUser } from "./UserProvider";

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

const ImageThumbNail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <div className="subtitle-2">{file.name}</div>
      <FormattedDateTime date={file.$createdAt} className="caption" />
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
        <DetailsRow
          label="Last Edit:"
          value={formatDateTime(file.$updatedAt)}
        />
      </div>
    </>
  );
};

export const DeleteFile = ({ file }: { file: Models.Document }) => {
  return (
    <p className="delete-confirmation">
      Are you sure you want to delete {` `}
      <span className="delete-file-name">{file.name}</span>
    </p>
  );
};

export const Share = ({ file, onInputChange, onRemove }: Props) => {
  const currentUser = useUser();

  return (
    <>
      <ImageThumbNail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">Share file with others</p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-100">
              {file.users.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                {email !== currentUser?.email && (
                  <Button
                    onClick={() => onRemove(email)}
                    className="share-remove-user"
                  >
                    <Image
                      src="/assets/icons/remove.svg"
                      alt="remove logo"
                      width={24}
                      height={24}
                      className="remove-icon"
                    />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
