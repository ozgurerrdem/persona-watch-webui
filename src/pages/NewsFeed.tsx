import { useState } from "react";
import FilterBar from "../components/FilterBar";
import NewsCard from "../components/NewsCard";
import api from "../services/api";
import dayjs from "dayjs";

type NewsItem = {
    title: string;
    content: string;
    link: string;
    platform: string;
    publishDate: string;
};

export default function NewsFeed() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [platformOptions, setPlatformOptions] = useState<string[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    const handleFilter = async (searchValue: string, dateRange: [string, string] | null) => {
        console.log("Filtreleme yapılıyor:", searchValue, dateRange);

        const params: any = { search: searchValue };

        if (dateRange) {
            const [fromLocal, toLocal] = dateRange;

            const dateFromUtc = dayjs(fromLocal).startOf('day').utc().format();
            const dateToUtc = dayjs(toLocal).endOf('day').utc().format();

            params.dateFrom = dateFromUtc;
            params.dateTo = dateToUtc;

            console.log("UTC Date Range:", dateFromUtc, dateToUtc);
        }

        try {
            const response = await api.get<NewsItem[]>(`/news`, { params });
            const data = response.data;

            setNewsList(data);

            // Domain bazlı unique platform listesi
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
        }
    };

    const handleTestClick = () => {
        const dummyData: NewsItem[] = [
            {
                title: "Dummy Haber",
                content: "Lorem ipsum...",
                link: "https://www.instagram.com/reel/abc123",
                platform: "Instagram",
                publishDate: "2025-05-16",
            },
            {
                title: "Başka Haber",
                content: "Başka içerik",
                link: "https://www.kartal.bel.tr/Haberler/123",
                platform: "Kartal Belediyesi",
                publishDate: "2025-05-16",
            },
        ];

        setNewsList(dummyData);

        const uniqueSites = Array.from(
            new Set(
                dummyData.map((item) => {
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
    };

    const handleAutoRefresh = () => {
        console.log("Sunucudan veri çekiliyor...");
    };

    const filteredNewsList = selectedPlatform
        ? newsList.filter((item) => {
            if (!item.link) return false;

            try {
                const hostname = new URL(item.link).hostname.replace(/^www\./, "").toLowerCase();
                const selected = selectedPlatform.toLowerCase();

                console.log("Comparing hostname:", hostname, "==", selected);

                return hostname === selected;
            } catch {
                return false;
            }
        })
        : newsList;

    return (
        <>
            <FilterBar
                platformOptions={platformOptions}
                onFilter={handleFilter}
                onPlatformChange={setSelectedPlatform}
                onTestData={handleTestClick}
                onRefresh={handleAutoRefresh}
            />

            <div className="flex flex-col">
                {filteredNewsList.map((item, index) => (
                    <NewsCard key={index} {...item} />
                ))}
            </div>
        </>
    );
}
