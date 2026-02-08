import sys
from youtube_transcript_api import YouTubeTranscriptApi

if len(sys.argv) > 1:
    video_id = sys.argv[1]
else:
    # Default/fallback for testing
    video_id = "l0K4XPu3Qhg"

api = YouTubeTranscriptApi()
transcript = api.fetch(video_id).to_raw_data()

import json
print(json.dumps(transcript))
