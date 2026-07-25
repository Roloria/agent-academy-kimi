import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import PathPage from "@/pages/path";
import PrinciplesPage from "@/pages/principles";
import FrameworksPage from "@/pages/frameworks";
import CapstonePage from "@/pages/capstone";
import ResourcesPage from "@/pages/resources";
import { NotFound } from "@/pages/stubs";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="path" element={<PathPage />} />
        <Route path="principles" element={<PrinciplesPage />} />
        <Route path="frameworks" element={<FrameworksPage />} />
        <Route path="capstone" element={<CapstonePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
