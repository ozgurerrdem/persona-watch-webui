import React from "react";

type YouTubeCardProps = {
    videoId: string;
    startSeconds?: number | null;
    title?: string;
};

const YouTubeCard: React.FC<YouTubeCardProps> = ({ videoId, startSeconds, title }) => {
    const src = `https://www.youtube.com/embed/${videoId}${startSeconds ? `?start=${startSeconds}` : ""}`;

    return (
        <div className="w-full aspect-video mt-4">
            <iframe
                width="100%"
                height="315"
                src={src}
                title={title || "YouTube Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default YouTubeCard;
