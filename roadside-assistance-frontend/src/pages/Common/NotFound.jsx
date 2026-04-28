import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const NotFound = () => (
  <>
    <Navbar />
    <section style={{ padding: "50px", textAlign: "center" }}>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: "#0d6efd" }}>Go back home</Link>
    </section>
  </>
);

export default NotFound;
