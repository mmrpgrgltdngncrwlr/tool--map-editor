Run('bun', 'run prettier . --write'.split(' '));
Run('cargo', ['fmt'], { cwd: '../back' });
