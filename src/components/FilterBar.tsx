import { Select, DatePicker, Button, Row, Col, Space, Input, message } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

type FilterBarProps = {
    platformOptions: string[];
    onFilter: (searchText: string, dateRange: [string, string] | null) => void;
    onPlatformChange: (platform: string | null) => void;
    onTestData: () => void;
    onRefresh: () => void;
};

export default function FilterBar({ platformOptions, onFilter, onPlatformChange, onTestData, onRefresh }: FilterBarProps) {
    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(1, 'month'),
        dayjs()
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleDateChange = (dates: any) => {
        setDateRange(dates);
    };

    const handleFilterClick = () => {
        if (!searchText.trim()) {
            message.warning("Aranacak kelime boş olamaz.");
            return;
        }

        const formattedRange: [string, string] | null = dateRange
            ? [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")]
            : null;

        onFilter(searchText, formattedRange);
    };

    return (
        <>
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: "1.5rem" }}>
                <Col>
                    <Input
                        placeholder="Aranacak kelime"
                        allowClear
                        value={searchText}
                        onChange={handleInputChange}
                        style={{ width: 200 }}
                    />
                </Col>

                <Col>
                    <DatePicker.RangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                    />
                </Col>

                <Col>
                    <Space>
                        <Button type="primary" onClick={handleFilterClick}>
                            Filtrele
                        </Button>
                        <Button onClick={onTestData}>
                            Test Verisi Ekle
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: "1.5rem" }}>
                <Col>
                    <Select
                        placeholder="Platform Seç"
                        style={{ width: 200 }}
                        options={platformOptions.map((p) => ({ value: p, label: p }))}
                        showSearch
                        allowClear
                        onChange={(value) => onPlatformChange(value || null)}
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
            </Row>
        </>
    );
}
