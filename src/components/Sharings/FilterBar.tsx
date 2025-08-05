import { Select, DatePicker, Button, Row, Col, Input, Typography, Tooltip, message } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import sourceDisplayMap from "../../constants/SourceDisplayMap";

type FilterBarProps = {
  platformOptions: string[];
  sourceOptions: string[];
  onFilter: (searchText: string, dateRange: [string, string] | null) => Promise<void>;
  onPlatformChange: (platform: string | null) => void;
  onSourceChange: (source: string | null) => void;
};

export default function FilterBar({
  platformOptions,
  sourceOptions,
  onFilter,
  onPlatformChange,
  onSourceChange
}: FilterBarProps) {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, "month"),
    dayjs()
  ]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleDateChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleFilterClick = async () => {
    if (!searchText.trim()) {
      message.warning("Aranacak kelime boş olamaz.");
      return;
    }

    setLoading(true);

    const formattedRange: [string, string] | null = dateRange
      ? [dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD")]
      : null;

    try {
      await onFilter(searchText, formattedRange);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
        error?.message ||
        "Beklenmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
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
          <DatePicker.RangePicker value={dateRange} onChange={handleDateChange} />
        </Col>
        <Col>
          <Tooltip title={!searchText.trim() ? "Arama yapabilmek için lütfen aranacak kelimeyi girin" : ""} placement="right">
            <Button
              type="primary"
              onClick={handleFilterClick}
              disabled={!searchText.trim()}
              loading={loading}
              style={{ minWidth: 100, justifyContent: "center" }}
            >
              Ara
            </Button>
          </Tooltip>
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
        <Col>
          <Select
            placeholder="Kaynak Seç"
            style={{ width: 200 }}
            options={sourceOptions.map((s) => ({
              value: s,
              label: sourceDisplayMap[s] || s
            }))}
            showSearch
            allowClear
            onChange={(value) => onSourceChange(value || null)}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>
      </Row>
    </>
  );
}
