import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const videoId = searchParams.get('videoId');

    if (!videoId) {
        return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    // Determine the path to the python script
    // In development, process.cwd() is the project root.
    const scriptPath = path.join(process.cwd(), 'src', 'app', 'api', 'youtube-transcribe', 'yt_transcript.py');

    return new Promise<Response>((resolve) => {
        // Spawn the python process
        // We assume 'python' is in the PATH. On some systems it might be 'python3'.
        const pythonProcess = spawn('python', [scriptPath, videoId]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorString);
                resolve(NextResponse.json({ error: 'Failed to fetch transcript', details: errorString }, { status: 500 }));
                return;
            }

            try {
                const transcript = JSON.parse(dataString);
                resolve(NextResponse.json({ transcript }));
            } catch (e) {
                console.error('Failed to parse JSON output:', dataString);
                resolve(NextResponse.json({ error: 'Invalid response from transcript script', output: dataString }, { status: 500 }));
            }
        });

        pythonProcess.on('error', (err) => {
            console.error('Failed to start python process:', err);
            resolve(NextResponse.json({ error: 'Failed to start transcription process' }, { status: 500 }));
        });
    });
}
