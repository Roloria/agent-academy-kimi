/** 平滑滚动到指定锚点（详情卡 / 区块） */
export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
