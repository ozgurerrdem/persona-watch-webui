import { useState } from "react";
import FilterBar from "../../components/Sharings/FilterBar";
import NewsCard from "../../components/Sharings/SharingCard";
import api from "../../services/api";
import dayjs from "dayjs";
import { Button, Empty, Typography } from "antd";
import "./SharingFeed.css";
import DoubleChevronIcon from "../../components/Sharings/DoubleChevronIcon";

type NewsItem = {
    title: string;
    content: string;
    link: string;
    platform: string;
    publishDate: string;
};

const ITEMS_PER_PAGE = 15;

export default function SharingFeed() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [platformOptions, setPlatformOptions] = useState<string[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const handleFilter = async (searchValue: string, dateRange: [string, string] | null) => {
        const params: any = { search: searchValue };

        if (dateRange) {
            const [fromLocal, toLocal] = dateRange;
            const dateFromUtc = dayjs(fromLocal).startOf("day").utc().format();
            const dateToUtc = dayjs(toLocal).endOf("day").utc().format();
            params.dateFrom = dateFromUtc;
            params.dateTo = dateToUtc;
        }

        try {
            const response = await api.get<NewsItem[]>("/news", { params });
            const data = response.data;
            console.log("Veri alındı:", data);
            setNewsList(data);
            setVisibleCount(ITEMS_PER_PAGE);

            const uniqueSites = Array.from(
                new Set(
                    data.map((item) => {
                        try {
                            const hostname = new URL(item.link).hostname;
                            return hostname.replace(/^www\./, "");
                        } catch {
                            return "invalid-url";
                        }
                    })
                )
            );

            setPlatformOptions(uniqueSites);
        } catch (error) {
            console.error("Veri alınamadı", error);
            throw error;
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const filteredNewsList = selectedPlatform
        ? newsList.filter((item) => {
            if (!item.link) return false;

            try {
                const hostname = new URL(item.link).hostname.replace(/^www\./, "").toLowerCase();
                const selected = selectedPlatform.toLowerCase();
                return hostname === selected;
            } catch {
                return false;
            }
        })
        : newsList;

    const visibleNewsList = filteredNewsList.slice(0, visibleCount);

    return (
        <>
            <FilterBar
                platformOptions={platformOptions}
                onFilter={handleFilter}
                onPlatformChange={setSelectedPlatform}
            />

            <div className="flex flex-col gap-4">
                {visibleNewsList.length > 0 ? (
                    visibleNewsList.map((item, index) => (
                        <NewsCard key={index} {...item} />
                    ))
                ) : (
                    <Empty description="İçerik bulunamadı" />
                )}
            </div>

            {visibleNewsList.length < filteredNewsList.length && (
                <div className="load-more-container" onClick={handleLoadMore}>
                    <Typography.Text className="load-more-text">
                        Daha Fazla Göster
                    </Typography.Text>
                    <div className="load-more-icon-wrapper">
                        <DoubleChevronIcon />
                    </div>
                </div>
            )}
        </>
    );
}
