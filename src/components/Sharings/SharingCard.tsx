import "dayjs/locale/tr";
import { Card, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import YouTubeCard from "./YoutubeCard";
import sourceDisplayMap from "../../constants/SourceDisplayMap";

dayjs.locale("tr");
dayjs.extend(utc);
dayjs.extend(timezone);

type NewsCardProps = {
  title: string;
  content: string;
  link: string;
  platform: string;
  source: string;
  publishDate?: string;
};

export default function SharingCard({
  title,
  content,
  link,
  platform,
  source,
  publishDate
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

  const readableSource = sourceDisplayMap[source] || source;

  return (
    <Card
      className="w-full"
      style={{
        margin: "1.5rem 0",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      <div className="flex justify-between items-start mb-3 relative">
        <div>
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
          {formattedDate && (
            <div>
              <Typography.Text type="secondary" style={{ fontSize: "0.85rem" }}>
                Bulunma zamanı: {formattedDate}
              </Typography.Text>
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 12,
            fontSize: "0.80rem",
            color: "#999",
            fontStyle: "italic",
            pointerEvents: "none",
            background: "rgba(255,255,255,0.90)",
            padding: "0 8px",
            borderRadius: "8px",
            zIndex: 2,
          }}
        >
          Kaynak: {readableSource}
        </div>
      </div>

      {startSeconds && (
        <Typography.Paragraph style={{ fontSize: "0.95rem", color: "#333" }}>
          Bu içerikte şu dakikada geçiyor: {formatSecondsToHMS(startSeconds)}
        </Typography.Paragraph>
      )}

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
