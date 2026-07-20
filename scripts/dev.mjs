import { spawn } from 'node:child_process';

const npmExecutable = process.env.npm_execpath;
const command = npmExecutable ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
const commands = [
  ['api', ['run', 'dev:api']],
  ['web', ['run', 'dev:web']],
];

const processes = commands.map(([name, args]) => {
  const childArgs = npmExecutable ? [npmExecutable, ...args] : args;
  const child = spawn(command, childArgs, { stdio: 'inherit' });
  child.on('exit', (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
  return child;
});

function stopChildren() {
  processes.forEach((child) => child.kill());
}

process.on('SIGINT', stopChildren);
process.on('SIGTERM', stopChildren);