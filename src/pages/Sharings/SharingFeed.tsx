import { useState } from "react";
import FilterBar from "../../components/Sharings/FilterBar";
import NewsCard from "../../components/Sharings/SharingCard";
import api from "../../services/api";
import dayjs from "dayjs";
import { Col, Empty, Pagination, Row } from "antd";
import "./SharingFeed.css";

type NewsItem = {
    title: string;
    content: string;
    link: string;
    platform: string;
    source: string;
    publishDate: string;
};

const ITEMS_PER_PAGE = 12;

export default function SharingFeed() {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [platformOptions, setPlatformOptions] = useState<string[]>([]);
    const [sourceOptions, setSourceOptions] = useState<string[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

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
            
            setNewsList(data);
            setCurrentPage(1);

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

            // Kaynak (source) seçenekleri
            const uniqueSources = Array.from(new Set(data.map(item => item.source).filter(Boolean)));
            setSourceOptions(uniqueSources);
        } catch (error) {
            console.error("Veri alınamadı", error);
            throw error;
        }
    };

    // Filtreleme: platform ve source birlikte
    const filteredNewsList = newsList.filter((item) => {
        let platformMatch = true, sourceMatch = true;
        if (selectedPlatform) {
            try {
                const hostname = new URL(item.link).hostname.replace(/^www\./, "").toLowerCase();
                platformMatch = hostname === selectedPlatform.toLowerCase();
            } catch {
                platformMatch = false;
            }
        }
        if (selectedSource) {
            sourceMatch = (item.source || "").toLowerCase() === selectedSource.toLowerCase();
        }
        return platformMatch && sourceMatch;
    });

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedNewsList = filteredNewsList.slice(startIndex, endIndex);

    // Pagination bileşeni
    const paginationBar = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={filteredNewsList.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                simple
            />
        </div>
    );

    return (
        <>
            <FilterBar
                platformOptions={platformOptions}
                sourceOptions={sourceOptions}
                onFilter={handleFilter}
                onPlatformChange={setSelectedPlatform}
                onSourceChange={setSelectedSource}
            />

            {filteredNewsList.length > ITEMS_PER_PAGE && paginationBar}

            <Row gutter={[24, 24]}>
                {paginatedNewsList.length > 0 ? (
                    paginatedNewsList.map((item, index) => (
                        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8} key={index}>
                            <NewsCard {...item} />
                        </Col>
                    ))
                ) : (
                    <Col span={24}>
                        <Empty description="İçerik bulunamadı" />
                    </Col>
                )}
            </Row>

            {filteredNewsList.length > ITEMS_PER_PAGE && paginationBar}
        </>
    );
}
