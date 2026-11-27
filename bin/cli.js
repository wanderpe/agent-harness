#!/usr/bin/env node

/**
 * agent-harness CLI
 * Production-grade agentic harness scaffolding tool.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

// ANSI Color Helpers
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
};

const PKG_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_ROOT = path.join(PKG_ROOT, 'templates');
const SKILLS_ROOT = path.join(PKG_ROOT, 'skills');

const STACKS = {
  'nextjs': {
    name: 'Next.js (App Router, React, Tailwind, shadcn/ui)',
    category: 'frontend',
    path: path.join(TEMPLATES_ROOT, 'frontend', 'nextjs'),
  },
  'laravel': {
    name: 'Laravel 12 / PHP 8.3 (Multi-tenancy, Passport, Best-practices)',
    category: 'backend',
    path: path.join(TEMPLATES_ROOT, 'backend', 'laravel'),
  },
  'node-typescript': {
    name: 'Node.js & TypeScript (Clean Architecture, Express/Nest/Fastify, Zod)',
    category: 'backend',
    path: path.join(TEMPLATES_ROOT, 'backend', 'node-typescript'),
  },
  'python-fastapi': {
    name: 'Python FastAPI (Pydantic v2, SQLAlchemy 2.0, pytest)',
    category: 'backend',
    path: path.join(TEMPLATES_ROOT, 'backend', 'python-fastapi'),
  },
  'base-only': {
    name: 'Base Universal Harness (Language-agnostic multi-agent pipeline)',
    category: 'core',
    path: null,
  }
};

function copyRecursiveSync(src, dest, replacements = {}) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        replacements
      );
    });
  } else if (exists) {
    // Read and apply template replacements
    const ext = path.extname(src).toLowerCase();
    const isText = ['.md', '.ts', '.js', '.json', '.php', '.py', '.yml', '.yaml', '.txt'].includes(ext);

    let destFile = dest;
    // Strip .template from target filename if present
    if (destFile.endsWith('.template.md')) {
      destFile = destFile.replace('.template.md', '.md');
    } else if (destFile.endsWith('.template.ts')) {
      destFile = destFile.replace('.template.ts', '.ts');
    } else if (destFile.endsWith('.template.php')) {
      destFile = destFile.replace('.template.php', '.php');
    }

    if (isText) {
      let content = fs.readFileSync(src, 'utf8');
      for (const [key, value] of Object.entries(replacements)) {
        content = content.split(key).join(value);
      }
      fs.writeFileSync(destFile, content, 'utf8');
    } else {
      fs.copyFileSync(src, destFile);
    }
  }
}

function detectProjectStack(targetDir) {
  if (fs.existsSync(path.join(targetDir, 'composer.json'))) {
    return 'laravel';
  }
  if (fs.existsSync(path.join(targetDir, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps['next']) return 'nextjs';
      if (deps['typescript']) return 'node-typescript';
    } catch (e) {}
    return 'node-typescript';
  }
  if (fs.existsSync(path.join(targetDir, 'requirements.txt')) || fs.existsSync(path.join(targetDir, 'pyproject.toml'))) {
    return 'python-fastapi';
  }
  return null;
}

function promptQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function handleInit(args) {
  const targetDir = process.cwd();
  const projectName = path.basename(targetDir);

  console.log(`\n${c.bold}${c.cyan}========================================${c.reset}`);
  console.log(`${c.bold}${c.green}   AGENT HARNESS INITIALIZER v1.0.3     ${c.reset}`);
  console.log(`${c.bold}${c.cyan}========================================${c.reset}\n`);

  let chosenStack = null;

  // Check flag argument: --stack <name>
  const stackFlagIndex = args.indexOf('--stack');
  if (stackFlagIndex !== -1 && args[stackFlagIndex + 1]) {
    const raw = args[stackFlagIndex + 1].toLowerCase();
    if (STACKS[raw]) {
      chosenStack = raw;
    }
  }

  // Auto-detect
  const detected = detectProjectStack(targetDir);
  if (!chosenStack && detected) {
    console.log(`${c.yellow}→ Auto-detected project signature:${c.reset} ${c.bold}${detected}${c.reset}`);
    const ans = await promptQuestion(`Use detected stack (${detected})? [Y/n]: `);
    if (ans.toLowerCase() !== 'n') {
      chosenStack = detected;
    }
  }

  // Interactive selection if not decided
  if (!chosenStack) {
    console.log(`Select the harness template for your codebase:\n`);
    const stackKeys = Object.keys(STACKS);
    stackKeys.forEach((key, index) => {
      console.log(`  ${c.bold}[${index + 1}]${c.reset} ${c.cyan}${key.padEnd(16)}${c.reset} - ${STACKS[key].name}`);
    });
    console.log('');
    const choice = await promptQuestion(`Choose [1-${stackKeys.length}] (default: 1): `);
    const num = parseInt(choice, 10);
    if (!isNaN(num) && num >= 1 && num <= stackKeys.length) {
      chosenStack = stackKeys[num - 1];
    } else {
      chosenStack = stackKeys[0];
    }
  }

  console.log(`\n${c.blue}→ Installing harness for:${c.reset} ${c.bold}${STACKS[chosenStack].name}${c.reset}`);

  const replacements = {
    '{{PROJECT_NAME}}': projectName,
    '{{WORKSPACE_ROOT}}': targetDir.replace(/\\/g, '/'),
  };

  // 1. Install Base Harness
  const baseSource = path.join(TEMPLATES_ROOT, '_base', '.agents');
  const targetAgentsDir = path.join(targetDir, '.agents');

  console.log(`${c.gray}  • Deploying base agent roles & tiered memory...${c.reset}`);
  copyRecursiveSync(baseSource, targetAgentsDir, replacements);

  // 2. Install Root AGENTS.md if not present
  const baseAgentsMd = path.join(TEMPLATES_ROOT, '_base', 'AGENTS.template.md');
  const targetAgentsMd = path.join(targetDir, 'AGENTS.md');

  // Check if stack has specialized AGENTS.md
  const stackAgentsMd = STACKS[chosenStack].path
    ? path.join(STACKS[chosenStack].path, 'AGENTS.template.md')
    : null;

  if (!fs.existsSync(targetAgentsMd)) {
    console.log(`${c.gray}  • Creating root AGENTS.md...${c.reset}`);
    const mdSource = (stackAgentsMd && fs.existsSync(stackAgentsMd)) ? stackAgentsMd : baseAgentsMd;
    copyRecursiveSync(mdSource, targetAgentsMd, replacements);
  }

  // 3. Overlay Stack Templates
  if (STACKS[chosenStack].path && fs.existsSync(STACKS[chosenStack].path)) {
    const stackAgentsSource = path.join(STACKS[chosenStack].path, '.agents');
    if (fs.existsSync(stackAgentsSource)) {
      console.log(`${c.gray}  • Overlaying ${chosenStack} skills, scripts, and workflows...${c.reset}`);
      copyRecursiveSync(stackAgentsSource, targetAgentsDir, replacements);
    }
  }

  // 4. Deploy Cross-Agent Thin Adapters (Claude Code, Cursor, VS Code Copilot)
  const adaptersFlagIndex = args.indexOf('--adapters');
  const adaptersRaw = (adaptersFlagIndex !== -1 && args[adaptersFlagIndex + 1])
    ? args[adaptersFlagIndex + 1].toLowerCase()
    : 'all';
  const enabledAdapters = adaptersRaw === 'none'
    ? []
    : adaptersRaw === 'all'
      ? ['claude', 'cursor', 'copilot']
      : adaptersRaw.split(',').map(s => s.trim()).filter(Boolean);

  const adaptersSrcDir = path.join(TEMPLATES_ROOT, '_base', 'adapters');
  const installedAdapters = ['antigravity', 'codex']; // Native AGENTS.md + .agents/ support

  function tryLinkSkills(linkDir) {
    try {
      const parent = path.dirname(linkDir);
      if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
      if (!fs.existsSync(linkDir)) {
        const linkType = process.platform === 'win32' ? 'junction' : 'dir';
        const targetSkills = path.join(targetDir, '.agents', 'skills');
        const linkTarget = process.platform === 'win32'
          ? targetSkills
          : path.relative(parent, targetSkills);
        fs.symlinkSync(linkTarget, linkDir, linkType);
        return true;
      }
    } catch (e) {
      // Graceful fallback when symlink permissions are restricted
    }
    return false;
  }

  if (enabledAdapters.includes('claude')) {
    const claudeMd = path.join(targetDir, 'CLAUDE.md');
    if (!fs.existsSync(claudeMd)) {
      copyRecursiveSync(path.join(adaptersSrcDir, 'CLAUDE.template.md'), claudeMd, replacements);
    }
    tryLinkSkills(path.join(targetDir, '.claude', 'skills'));
    installedAdapters.push('claude');
  }

  if (enabledAdapters.includes('cursor')) {
    const cursorRuleDir = path.join(targetDir, '.cursor', 'rules');
    const cursorRuleFile = path.join(cursorRuleDir, 'agent-harness.mdc');
    if (!fs.existsSync(cursorRuleFile)) {
      if (!fs.existsSync(cursorRuleDir)) fs.mkdirSync(cursorRuleDir, { recursive: true });
      copyRecursiveSync(path.join(adaptersSrcDir, 'cursor-agent-harness.mdc'), cursorRuleFile, replacements);
    }
    tryLinkSkills(path.join(targetDir, '.cursor', 'skills'));
    installedAdapters.push('cursor');
  }

  if (enabledAdapters.includes('copilot')) {
    const githubDir = path.join(targetDir, '.github');
    const copilotFile = path.join(githubDir, 'copilot-instructions.md');
    if (!fs.existsSync(copilotFile)) {
      if (!fs.existsSync(githubDir)) fs.mkdirSync(githubDir, { recursive: true });
      copyRecursiveSync(path.join(adaptersSrcDir, 'copilot-instructions.template.md'), copilotFile, replacements);
    }
    installedAdapters.push('copilot');
  }

  if (enabledAdapters.length > 0) {
    console.log(`${c.gray}  • Wired cross-agent adapters: ${installedAdapters.join(', ')}...${c.reset}`);
  }

  // 5. Write .agents/config.json
  const config = {
    version: '1.0.3',
    stack: chosenStack,
    adapters: installedAdapters,
    installedAt: new Date().toISOString(),
    roles: [
      'architect',
      'code-reviewer',
      'implementation-engineer',
      'qa-validator',
      'release-manager',
      'task-context-builder'
    ],
  };
  fs.writeFileSync(path.join(targetAgentsDir, 'config.json'), JSON.stringify(config, null, 2), 'utf8');

  console.log(`\n${c.bold}${c.green}✔ Successfully scaffolded agent harness!${c.reset}\n`);
  console.log(`Summary of deployed assets:`);
  console.log(`  ${c.cyan}.agents/agents/${c.reset}              - 6 core role definitions`);
  console.log(`  ${c.cyan}.agents/memory/${c.reset}              - Tiered memory & system conventions`);
  console.log(`  ${c.cyan}.agents/workflows/${c.reset}           - Multi-agent and hotfix pipelines`);
  console.log(`  ${c.cyan}.agents/rules/${c.reset}               - Engineering & QA test standards`);
  console.log(`  ${c.cyan}.agents/skills/${c.reset}              - Lean built-in Caveman (5) + Engineering (8) + stack skills`);
  console.log(`  ${c.cyan}AGENTS.md${c.reset}                    - Universal root entrypoint (Antigravity, Codex, OpenCode)`);
  if (enabledAdapters.includes('claude')) {
    console.log(`  ${c.cyan}CLAUDE.md + .claude/skills${c.reset}   - Claude Code adapter (linked to .agents/skills)`);
  }
  if (enabledAdapters.includes('cursor')) {
    console.log(`  ${c.cyan}.cursor/rules/agent-harness.mdc${c.reset} - Cursor adapter (linked to .agents/skills)`);
  }
  if (enabledAdapters.includes('copilot')) {
    console.log(`  ${c.cyan}.github/copilot-instructions.md${c.reset} - VS Code / GitHub Copilot adapter`);
  }
  console.log(`\n${c.bold}${c.green}✔ Ready across Antigravity, Claude Code, Codex, Cursor, and VS Code Copilot with zero duplication!${c.reset}`);

  // 6. Prerequisite Check for Live QA Loops (Playwright / Postman / Newman)
  function hasCommand(cmd) {
    const checker = process.platform === 'win32' ? 'where' : 'which';
    const res = spawnSync(checker, [cmd], { stdio: 'ignore' });
    return res.status === 0;
  }

  function hasPkgDep(depNames) {
    const pkgPath = path.join(targetDir, 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      return depNames.some(d => Boolean(allDeps[d]));
    } catch (e) {
      return false;
    }
  }

  const warnings = [];
  if (STACKS[chosenStack].category === 'frontend') {
    const hasPlaywright = hasPkgDep(['playwright', '@playwright/test']) || hasCommand('playwright');
    if (!hasPlaywright) {
      warnings.push(
        `Playwright not detected (needed for live-web-tester & live-test-and-hotfix.md).\n` +
        `    Install CLI: ${c.cyan}npm i -D @playwright/test && npx playwright install${c.reset}\n` +
        `    Enable MCP:  Add ${c.cyan}@playwright/mcp${c.reset} to your AI IDE MCP config`
      );
    }
  } else if (STACKS[chosenStack].category === 'backend') {
    const hasPostmanOrNewman = hasCommand('newman') || hasCommand('postman') || hasPkgDep(['newman']);
    if (!hasPostmanOrNewman) {
      warnings.push(
        `Postman CLI / Newman not detected (needed for live-api-tester & api-test-and-hotfix.md).\n` +
        `    Install CLI: ${c.cyan}npm i -g newman${c.reset} (or Postman CLI)\n` +
        `    Enable MCP:  Configure the ${c.cyan}Postman MCP server${c.reset} in your AI IDE MCP config`
      );
    }
  }

  if (warnings.length > 0) {
    console.log(`\n${c.bold}${c.yellow}⚠ Live QA Prerequisites Warning:${c.reset}`);
    warnings.forEach(w => console.log(`  ${c.yellow}•${c.reset} ${w}`));
  }
  console.log('');
}

function handleListSkills() {
  console.log(`\n${c.bold}${c.cyan}Available Curated Agent Skills:${c.reset}\n`);
  if (!fs.existsSync(SKILLS_ROOT)) {
    console.log('No skills directory found.');
    return;
  }
  const skills = fs.readdirSync(SKILLS_ROOT).filter(f => fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory());
  skills.forEach(sk => {
    let desc = '';
    const skillMd = path.join(SKILLS_ROOT, sk, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      const content = fs.readFileSync(skillMd, 'utf8');
      const match = content.match(/description:\s*(.+)/i);
      if (match) desc = match[1].trim();
    }
    console.log(`  ${c.green}• ${sk.padEnd(28)}${c.reset} ${c.gray}${desc.slice(0, 70)}${c.reset}`);
  });
  console.log(`\n${c.yellow}Install any skill via:${c.reset} npx agent-harness add-skill <name>\n`);
}

function handleAddSkill(args) {
  const skillName = args[1];
  if (!skillName) {
    console.log(`${c.red}Error:${c.reset} Please provide a skill name.`);
    console.log(`Example: npx agent-harness add-skill playwright-e2e`);
    return;
  }

  const srcSkill = path.join(SKILLS_ROOT, skillName);
  if (!fs.existsSync(srcSkill)) {
    console.log(`${c.red}Error:${c.reset} Skill '${skillName}' not found.`);
    console.log(`Run ${c.yellow}npx agent-harness list-skills${c.reset} to see all available skills.`);
    return;
  }

  const destDir = path.join(process.cwd(), '.agents', 'skills', skillName);
  copyRecursiveSync(srcSkill, destDir);
  console.log(`${c.green}✔ Skill '${skillName}' installed into .agents/skills/${skillName}${c.reset}`);
}

function showHelp() {
  console.log(`
${c.bold}${c.cyan}agent-harness CLI${c.reset} - Reusable Agentic Engineering Harness

${c.bold}USAGE:${c.reset}
  npx agent-harness <command> [options]

${c.bold}COMMANDS:${c.reset}
  ${c.green}init${c.reset}                  Scaffold .agents harness into current repository
  ${c.green}init --stack <name>${c.reset}   Scaffold directly with chosen stack:
                        • nextjs
                        • laravel
                        • node-typescript
                        • python-fastapi
                        • base-only
  ${c.green}init --adapters <list>${c.reset} Cross-agent adapters (default: all):
                        • all (Claude Code + Cursor + VS Code Copilot + native AGENTS.md)
                        • claude,cursor,copilot (comma-separated subset)
                        • none (AGENTS.md + .agents/ only)
  ${c.green}list-skills${c.reset}           List all curated autonomous engineering skills
  ${c.green}add-skill <name>${c.reset}      Add a specific curated skill to .agents/skills/
  ${c.green}help${c.reset}                  Show this help manual

${c.bold}EXAMPLES:${c.reset}
  npx agent-harness init
  npx agent-harness init --stack nextjs
  npx agent-harness add-skill playwright-e2e
`);
}

async function main() {
  const args = process.argv.slice(2);
  // Default to `init` when invoked as `npx create-agent-harness` or `npx create-agent-harness --stack nextjs`
  const first = args[0];
  const command = (!first || first.startsWith('--')) ? (first === '--help' || first === '-h' || first === '--version' || first === '-v' ? first : 'init') : first;

  switch (command) {
    case 'init':
      await handleInit(args);
      break;
    case 'list':
    case 'list-skills':
      handleListSkills();
      break;
    case 'add':
    case 'add-skill':
      handleAddSkill(args);
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    case '--version':
    case '-v':
      console.log('1.0.3');
      break;
    default:
      console.log(`${c.red}Unknown command: ${command}${c.reset}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(`${c.red}Fatal error:${c.reset}`, err);
  process.exit(1);
});
