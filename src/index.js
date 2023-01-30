import React from "react";
import { createRoot } from "react-dom/client";
import AdminComp from "./AdminComp";

function App() {
  return (
    <div>
        <AdminComp/>
    </div>
  )
}

const root = createRoot(document.querySelector("#app"))
root.render(<App/>)

