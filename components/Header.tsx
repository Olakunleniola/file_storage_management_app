"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/users.actions";

const Header = ({ $id, accountId }: headerProps) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={$id} accountId={accountId} />
        {/* <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
        </form> */}
        <Button
          type="submit"
          className="sign-out-button"
          onClick={async () => {
            window.location.href = "/sign-in";
            await signOutUser();
          }}
        >
          <Image
            src="./assets/icons/logout.svg"
            alt="logout logo"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
