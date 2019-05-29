import React from "react";
import { Link } from "react-router-dom";
import WebURI from "../urls/WebsiteURIs";

function SimpleNav() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={WebURI.Home}>Home</Link>
          </li>
          <li>
            <Link to={WebURI.UploadPublication}>Upload a Publication</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SimpleNav;
