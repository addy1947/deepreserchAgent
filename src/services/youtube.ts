export interface TranscriptSegment {
    text: string;
    start: number;
    duration: number;
}

export interface YoutubeTranscriptResponse {
    transcript?: TranscriptSegment[];
    error?: string;
    details?: string;
}

export const getYoutubeTranscript = async ({ videoId }: { videoId: string }): Promise<YoutubeTranscriptResponse> => {
    try {
        const response = await fetch(`/api/youtube-transcribe?videoId=${videoId}`);
        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || "Failed to fetch transcript", details: data.details };
        }

        return data;
    } catch (error) {
        console.error("Error fetching YouTube transcript:", error);
        return { error: "Network error while fetching transcript" };
    }
};
