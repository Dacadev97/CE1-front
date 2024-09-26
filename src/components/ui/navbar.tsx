import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const url = window.location.href;
    const urlTitle = (url.split("/").pop() || "Home").toUpperCase();
    setTitle(urlTitle);
  }, []);

  return (
    <nav className="flex justify-center items-center h-16 bg-gray-800 text-white">
      <h1 className="text-xl">{title}</h1>
    </nav>
  );
};

export default Navbar;
