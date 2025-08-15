import node_child_process from 'node:child_process';
export function Run({ program, args = [], options = {} }) {
  return new Promise((resolve, reject) => {
    console.log(`[${new Date().toLocaleTimeString()}] > ${program} ${args.join(' ')}`);
    node_child_process.execFile(program, args, options, (error, stdout, stderr) => {
      if (error) return reject(error);
      return resolve({ stdout, stderr });
    });
  });
}
export async function PipeStdio(command) {
  const { stdout, stderr } = await command;
  if (stdout) console.log(stdout.slice(0, stdout.lastIndexOf('\n')));
  if (stderr) console.log(stderr.slice(0, stderr.lastIndexOf('\n')));
}
