import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerMemoryTools } from '@/lib/mcp/tools/memories'

export function createMcpServer() {
  const server = new McpServer({
    name: 'memory-mcp',
    version: '0.1.0',
  })

  registerMemoryTools(server)

  return server
}
