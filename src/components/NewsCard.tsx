import { Card, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

type NewsCardProps = {
  title: string;
  content: string;
  link: string;
  platform: string;
  publishDate?: string;
};

export default function NewsCard({ title, content, link, platform, publishDate }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const truncatedContent = content.length > 150 ? content.substring(0, 150) : content;

  const getPlatformFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const domain = hostname.replace("www.", "").split('.')[0];
      return domain.toUpperCase();
    } catch {
      return "WEB SİTESİ";
    }
  };

  const faviconUrl = link ? `https://www.google.com/s2/favicons?sz=32&domain=${link}` : "";

  const formattedDate = publishDate ? dayjs(publishDate).format("DD MMMM YYYY HH:mm") : null;

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

  const isYouTube = platform.toLowerCase() === "youtube";
  const youTubeVideoId = isYouTube ? extractYouTubeVideoId(link) : null;

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
              src={faviconUrl}
              alt="favicon"
              style={{ marginRight: "0.5rem", width: 16, height: 16 }}
            />
          )}
          <Typography.Text strong>{title}</Typography.Text>
          {link && !isYouTube && (
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
            {formattedDate}
          </Typography.Text>
        )}
      </div>

      {youTubeVideoId ? (
        <div className="w-full aspect-video">
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
      ) : (
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
      )}
    </Card>
  );
}
