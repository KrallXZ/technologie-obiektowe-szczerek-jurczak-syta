import StorageIcon from "@mui/icons-material/Storage";
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header>
      <Link
        href="/">
        <span className="text-5xl flex items-center font-semibold">
          <StorageIcon fontSize="large" /> DMS
        </span>
      </Link>
    </header>
  );
};

export default Header;