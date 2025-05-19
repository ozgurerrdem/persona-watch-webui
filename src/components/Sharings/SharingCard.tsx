import { Card, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

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

  const truncatedContent = content.length > 150 ? content.substring(0, 150) : content;

  const getFaviconUrl = (url: string): string =>
    `https://www.google.com/s2/favicons?sz=32&domain=${url}`;

  const isYouTubeLink = (url: string): boolean => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.includes("youtube.com") || hostname.includes("youtu.be");
    } catch {
      return false;
    }
  };

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

  const youTubeVideoId = isYouTubeLink(link) ? extractYouTubeVideoId(link) : null;

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
          <Typography.Text strong>{title}</Typography.Text>
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

      {youTubeVideoId && (
        <div className="w-full aspect-video mt-4">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${youTubeVideoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </Card>
  );
}
