import Link from "next/link";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDatteTime from "./FormattedDatteTime";
import ActionDropDown from "./ActionDropDown";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link href={file.url} target="_blank" className="file-card ">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionDropDown />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className="file-card-details space-y-1">
        <p className="subtitle-2 line-clamp-1 truncate">{file.name}</p>
        <FormattedDatteTime date={file.$createdAt} className="body-2 text-light-100" />
        <p className="caption line-clamp-1 text-light-200">{file.owner.fullName}</p>
      </div>
    </Link>
  );
};

export default Card;
