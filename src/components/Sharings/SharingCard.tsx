import { Card, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import YouTubeCard from "./YoutubeCard";

dayjs.extend(utc);
dayjs.extend(timezone);

type NewsCardProps = {
  title: string;
  content: string;
  link: string;
  platform: string;
  publishDate?: string;
};

export default function SharingCard({
  title,
  content,
  link,
  platform,
  publishDate,
}: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) : content;

  const getFaviconUrl = (url: string): string =>
    `https://www.google.com/s2/favicons?sz=32&domain=${url}`;

  const isYouTubeLink = (url: string): boolean =>
    /(?:youtube\.com|youtu\.be)/i.test(url);

  const extractYouTubeVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtube.com")) {
        if (parsedUrl.pathname.startsWith("/embed/")) {
          return parsedUrl.pathname.split("/embed/")[1];
        }
        return parsedUrl.searchParams.get("v");
      }
      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.split("/")[1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const extractStartTimeSeconds = (url: string): number | null => {
    try {
      const parsedUrl = new URL(url);
      const tParam = parsedUrl.searchParams.get("t");
      if (tParam) {
        const match = tParam.match(/^(\d+)s?$/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const formatSecondsToHMS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const youTubeVideoId = isYouTubeLink(link) ? extractYouTubeVideoId(link) : null;
  const startSeconds = extractStartTimeSeconds(link);
  const isYouTube = isYouTubeLink(link);

  const hideDefaultTitle = isYouTube && title === content;

  const formattedDate = publishDate
    ? dayjs.utc(publishDate).local().format("DD MMMM YYYY HH:mm")
    : null;

  return (
    <Card
      className="w-full"
      style={{
        margin: "1.5rem 0",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {link && (
            <img
              src={getFaviconUrl(link)}
              alt="favicon"
              style={{ marginRight: "0.5rem", width: 16, height: 16 }}
            />
          )}
          {!hideDefaultTitle && (
            <Typography.Text strong>{title}</Typography.Text>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "0.5rem", fontSize: "1rem", color: "#595959" }}
            >
              <LinkOutlined />
            </a>
          )}
        </div>
        {formattedDate && (
          <Typography.Text type="secondary" style={{ fontSize: "0.85rem" }}>
            Bulunma zamanı: {formattedDate}
          </Typography.Text>
        )}
      </div>

      {startSeconds && (
        <Typography.Paragraph style={{ fontSize: "0.95rem", color: "#333" }}>
          Bu içerikte şu dakikada geçiyor: {formatSecondsToHMS(startSeconds)}
        </Typography.Paragraph>
      )}

      {/* Açıklama tüm platformlar için gösterilir */}
      <Typography.Paragraph style={{ lineHeight: "1.6", fontSize: "0.95rem", color: "#333" }}>
        {expanded ? content : truncatedContent}
        {content.length > 150 && !expanded && (
          <>
            ...{" "}
            <Typography.Link onClick={() => setExpanded(true)}>
              Devamını Oku
            </Typography.Link>
          </>
        )}
        {expanded && content.length > 150 && (
          <>
            {" "}
            <Typography.Link onClick={() => setExpanded(false)}>
              Gizle
            </Typography.Link>
          </>
        )}
      </Typography.Paragraph>

      {/* YouTube video gösterimi */}
      {isYouTube && youTubeVideoId && (
        <YouTubeCard
          videoId={youTubeVideoId}
          startSeconds={startSeconds}
          title={title}
        />
      )}
    </Card>
  );
}
