import { Link } from "react-router";

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-content flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-6xl font-bold text-c-perceive">404</p>
      <h1 className="mt-4 text-h2 font-bold text-text-primary">页面不存在</h1>
      <p className="mt-3 font-mono text-caption text-text-tertiary">
        $ agent.navigate("?") ✗ 404 Not Found
      </p>
      <Link
        to="/"
        className="btn-outline-grad mt-10 px-6 py-2.5 text-[15px] font-medium text-text-primary"
      >
        返回首页 →
      </Link>
    </section>
  );
}
