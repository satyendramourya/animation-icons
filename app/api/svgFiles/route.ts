import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const svgFiles = fs.readdirSync(path.join(process.cwd(), 'public', 'svg'));
    return NextResponse.json(svgFiles);
}
