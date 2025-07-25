"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFIleUser,
  renameFiles,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { Share, DeleteFile, FileDetails } from "./ActionsModalContent";
import { toast } from "sonner";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(file.users);
  const path = usePathname();

  const closeAllModals = () => {
    setIsDropDownOpen(false);
    setIsModalOpen(false);
    setName(file.name);
    setAction(null);
  };

  const handleAction = async () => {
    if (!action) return;
    let success = false;
    setIsLoading(true);
    const actions = {
      rename: () =>
        renameFiles({
          fileId: file.$id,
          name: name,
          path: path,
          extension: file.extension,
        }),
      share: () =>
        updateFileUsers({ fileId: file.$id, emails, path, action: "share" }),
      delete: () =>
        deleteFIleUser({
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        }),
    };
    try {
      success = await actions[action.value as keyof typeof actions]();
      if (success) {
        closeAllModals();
        console.log(action);
        toast.success(`File ${action.value}d successfully`, {
          className: "success-toast",
        });
      }
    } catch {
      toast.error(`An error occurred while trying to ${action} file`, {
        className: "error-toast",
      });
      console.error("An error occurred while trying to perform action");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    const success = await updateFileUsers({
      fileId: file.$id,
      emails: [email],
      path,
      action: "remove",
    });
    if (success) {
      toast.success("File removed successfully", {
        className: "success-toast",
      });
    }
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "delete" && <DeleteFile file={file} />}
          {value === "share" && (
            <Share
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button className="modal-cancel-button" onClick={closeAllModals}>
              Cancel
            </Button>
            <Button className="modal-submit-button" onClick={handleAction}>
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="h-auto animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="menu logo"
            width={24}
            height={24}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(item);
                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  className="flex items-center gap-2"
                  download={file.name}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
