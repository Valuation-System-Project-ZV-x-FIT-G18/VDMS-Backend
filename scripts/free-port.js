const { execSync } = require('child_process');

function getPortFromEnv() {
  const raw = process.env.PORT || '3000';
  const port = Number.parseInt(raw, 10);
  return Number.isFinite(port) ? port : 3000;
}

function parseWindowsPids(netstatOutput) {
  const pids = new Set();

  for (const line of netstatOutput.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes('LISTENING')) continue;

    const cols = trimmed.split(/\s+/);
    const pid = cols[cols.length - 1];
    if (/^\d+$/.test(pid) && pid !== '0') {
      pids.add(pid);
    }
  }

  return Array.from(pids);
}

function freePortWindows(port) {
  let output = '';
  try {
    output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    console.log(`[free-port] Port ${port} is already free.`);
    return;
  }

  const pids = parseWindowsPids(output);
  if (pids.length === 0) {
    console.log(`[free-port] Port ${port} is already free.`);
    return;
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`[free-port] Killed PID ${pid} on port ${port}.`);
    } catch {
      console.log(`[free-port] Could not kill PID ${pid}. Continuing...`);
    }
  }
}

function freePortUnix(port) {
  let output = '';
  try {
    output = execSync(`lsof -ti tcp:${port}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    console.log(`[free-port] Port ${port} is already free.`);
    return;
  }

  if (!output) {
    console.log(`[free-port] Port ${port} is already free.`);
    return;
  }

  const pids = output.split(/\s+/).filter(Boolean);
  for (const pid of pids) {
    try {
      process.kill(Number.parseInt(pid, 10), 'SIGKILL');
      console.log(`[free-port] Killed PID ${pid} on port ${port}.`);
    } catch {
      console.log(`[free-port] Could not kill PID ${pid}. Continuing...`);
    }
  }
}

const port = getPortFromEnv();

if (process.platform === 'win32') {
  freePortWindows(port);
} else {
  freePortUnix(port);
}
