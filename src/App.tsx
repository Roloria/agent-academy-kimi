import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import PathPage from "@/pages/path";
import PrinciplesPage from "@/pages/principles";
import FrameworksPage from "@/pages/frameworks";
import McpPage from "@/pages/mcp";
import CapstonePage from "@/pages/capstone";
import SandboxPage from "@/pages/sandbox";
import ResourcesPage from "@/pages/resources";
import { NotFound } from "@/pages/stubs";
import HomeEn from "@/pages/en/HomeEn";
import PathEn from "@/pages/en/PathEn";
import PrinciplesEn from "@/pages/en/PrinciplesEn";
import FrameworksEn from "@/pages/en/FrameworksEn";
import McpEn from "@/pages/en/McpEn";
import CapstoneEn from "@/pages/en/CapstoneEn";
import SandboxEn from "@/pages/en/SandboxEn";
import ResourcesEn from "@/pages/en/ResourcesEn";

/**
 * 双语平行路由（v2-design.md §2.1）：
 * `/` 分支 = 中文（默认），`/en` 分支 = English。
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 中文（默认） */}
        <Route index element={<Home />} />
        <Route path="path" element={<PathPage />} />
        <Route path="principles" element={<PrinciplesPage />} />
        <Route path="frameworks" element={<FrameworksPage />} />
        <Route path="mcp" element={<McpPage />} />
        <Route path="capstone" element={<CapstonePage />} />
        <Route path="sandbox" element={<SandboxPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        {/* English */}
        <Route path="en">
          <Route index element={<HomeEn />} />
          <Route path="path" element={<PathEn />} />
          <Route path="principles" element={<PrinciplesEn />} />
          <Route path="frameworks" element={<FrameworksEn />} />
          <Route path="mcp" element={<McpEn />} />
          <Route path="capstone" element={<CapstoneEn />} />
          <Route path="sandbox" element={<SandboxEn />} />
          <Route path="resources" element={<ResourcesEn />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
