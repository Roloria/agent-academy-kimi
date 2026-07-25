/**
 * MCP 专题页代码常量（research/v2/mcp.md §2 逐字保真，双语共用）。
 * 注意：全部使用 String.raw，保留代码中的 \n、\ 等转义字面量。
 */

/** STEP 1 · 安装官方 Python SDK */
export const CODE_INSTALL = String.raw`# 推荐 uv
uv add "mcp[cli]"
# 或 pip
pip install "mcp[cli]"`;

/** STEP 2 · 最小可运行 Server（FastMCP 高级 API） */
export const CODE_SERVER = String.raw`# server.py
from mcp.server.fastmcp import FastMCP

# 1. 创建 Server 实例，名字会展示给客户端
mcp = FastMCP("demo-server")

# 2. 暴露工具：docstring 就是给模型看的工具说明，务必写清楚
@mcp.tool()
def add(a: int, b: int) -> int:
    """将两个整数相加并返回结果。"""
    return a + b

@mcp.tool()
def get_weather(city: str) -> str:
    """查询指定城市的天气（演示用假数据）。

    Args:
        city: 城市名，例如 "北京"
    """
    return f"{city}：晴，26°C（示例数据）"

# 3. 暴露资源：URI 模板 + 读取函数
@mcp.resource("config://settings")
def get_settings() -> str:
    """应用配置"""
    return '{"theme": "dark", "language": "zh"}'

# 4. 暴露提示词模板
@mcp.prompt()
def summarize(text: str) -> str:
    """生成内容摘要"""
    return f"请用三句话总结以下内容：\n\n{text}"

if __name__ == "__main__":
    mcp.run()  # 默认走 stdio；远程部署用 mcp.run(transport="streamable-http")`;

/** STEP 3 · MCP Inspector */
export const CODE_INSPECTOR = String.raw`# SDK 自带调试 UI，可视化地调用你的工具/资源/提示词
mcp dev server.py`;

/** STEP 4 · Claude Desktop stdio 配置 */
export const CODE_CLAUDE_STDIO = String.raw`{
  "mcpServers": {
    "demo": {
      "command": "/绝对路径/uv",
      "args": ["--directory", "/你的项目目录", "run", "server.py"]
    }
  }
}`;

/** STEP 4 · 远程 Server 配置 */
export const CODE_CLAUDE_REMOTE = String.raw`{
  "mcpServers": {
    "remote-demo": {
      "type": "streamable-http",
      "url": "https://example.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}`;

/** STEP 5 · 官方 SDK 客户端写法 */
export const CODE_CLIENT = String.raw`import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    params = StdioServerParameters(command="python", args=["server.py"])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()      # 动态发现工具
            print([t.name for t in tools.tools])
            result = await session.call_tool("add", {"a": 3, "b": 5})
            print(result.content[0].text)           # -> 8

asyncio.run(main())`;
