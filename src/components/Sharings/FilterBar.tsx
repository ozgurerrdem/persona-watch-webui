import { Select, DatePicker, Button, Row, Col, Input, message, Tooltip, Typography } from "antd";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";

type FilterBarProps = {
    platformOptions: string[];
    onFilter: (searchText: string, dateRange: [string, string] | null) => Promise<void>;
    onPlatformChange: (platform: string | null) => void;
};

export default function FilterBar({ platformOptions, onFilter, onPlatformChange }: FilterBarProps) {
    const AUTO_REFRESH_SECONDS = 10;

    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(1, 'month'),
        dayjs()
    ]);
    const [counter, setCounter] = useState(AUTO_REFRESH_SECONDS);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const [pauseCounter, setPauseCounter] = useState(false);
    const [shouldAutoRefresh, setShouldAutoRefresh] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isInputEmpty = !searchText.trim();

    useEffect(() => {
        if (isInputEmpty) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCounter(AUTO_REFRESH_SECONDS);
            return;
        }

        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            if (pauseCounter) return;

            setCounter(prev => {
                if (prev === 1) {
                    if (!loadingRef.current) {
                        setShouldAutoRefresh(true);
                        return AUTO_REFRESH_SECONDS;
                    } else {
                        return 1;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isInputEmpty, pauseCounter, searchText, dateRange]);

    useEffect(() => {
        if (!shouldAutoRefresh) return;

        const run = async () => {
            const formattedRange: [string, string] | null = dateRange
                ? [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")]
                : null;

            setLoading(true);
            loadingRef.current = true;
            setPauseCounter(true);

            try {
                await onFilter(searchText, formattedRange);
                setCounter(AUTO_REFRESH_SECONDS);
                setErrorMessage(null);
            } catch (error: any) {
                const msg =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Beklenmeyen bir hata oluştu.";
                setErrorMessage(msg);
                setPauseCounter(true);
                message.error(msg);
            } finally {
                setLoading(false);
                loadingRef.current = false;
                setShouldAutoRefresh(false);
                setPauseCounter(false);
            }
        };

        run();
    }, [shouldAutoRefresh]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleDateChange = (dates: any) => {
        setDateRange(dates);
    };

    const handleFilterClick = async () => {
        if (isInputEmpty) {
            message.warning("Aranacak kelime boş olamaz.");
            return;
        }

        setLoading(true);
        loadingRef.current = true;
        setPauseCounter(true);
        setErrorMessage(null);

        const formattedRange: [string, string] | null = dateRange
            ? [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")]
            : null;

        try {
            await onFilter(searchText, formattedRange);
            setCounter(AUTO_REFRESH_SECONDS);
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Beklenmeyen bir hata oluştu.";
            setErrorMessage(msg);
            setPauseCounter(true);
            message.error(msg);
        } finally {
                setLoading(false);
                loadingRef.current = false;
                setPauseCounter(false);
        }
    };

    return (
        <>
            <Row gutter={[8, 8]} align="middle" style={{ marginBottom: "1.5rem" }}>
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
                    <Tooltip
                        title={isInputEmpty ? "Arama yapabilmek için lütfen aranacak kelimeyi girin" : ""}
                        placement="right"
                    >
                        <Button
                            type="primary"
                            onClick={handleFilterClick}
                            disabled={isInputEmpty}
                            loading={loading}
                            style={{ minWidth: 190, justifyContent: "center" }}
                        >
                            {!loading &&
                                (errorMessage
                                    ? "Tekrar Dene"
                                    : `${counter} sn içinde yenilenecek`)}
                        </Button>
                    </Tooltip>
                </Col>

                {errorMessage && (
                    <Col>
                        <Typography.Text type="danger" style={{ fontSize: 13 }}>
                            {errorMessage}
                        </Typography.Text>
                    </Col>
                )}
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
