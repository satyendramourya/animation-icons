import fs from 'fs';
import path from 'path';

export function getSvgFiles() {
    return fs.readdirSync(path.join(process.cwd(), 'public', 'svg'));
}
