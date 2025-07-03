"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormattedDatteTime from "./FormattedDatteTime";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [result, setResult] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debounceQuery] = useDebounce(query, 1000);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debounceQuery.length === 0) {
        setResult([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      try {
        const files = await getFiles({
          searchText: query,
          types: [],
        });
        setResult(files.documents);
        setOpen(true);
      } catch (error) {
        toast.error(error as string, { className: "error-toast" });
      }
    };
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResult([]);
    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + "s"
      }?query=${file.name}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
        <Input
          type="text"
          placeholder="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          className="search-input"
        />
        {open && (
          <ul className="search-result">
            {result.length > 0 ? (
              result.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between gap-2 hover:bg-light-300 p-2 rounded-md"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      extension={file.extension}
                      url={file.url}
                      type={file.type}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                    <FormattedDatteTime
                      date={file.$createdAt}
                      className="caption line-clamp-1 text-light-200"
                    />
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-result">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
