#!/bin/bash
# Quick start script for local testing
# Usage: source .testing-quick-start.sh

echo "🔧 Setting up Promptonomicon for local testing..."
echo ""

# Build and link packages
echo "📦 Building MCP server and linking packages..."
yarn build:mcp
yarn link
cd packages/mcp-server && yarn link && cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to your test repository"
echo "2. Run: yarn link promptonomicon"
echo "3. Run: yarn link promptonomicon-mcp"
echo "4. Test with: promptonomicon init"
