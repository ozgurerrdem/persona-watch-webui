import { useEffect, useState } from "react";
import { Typography, message, Button, Select, Input, Table, Tag, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { scannerDisplayMap } from "../../constants/displayMap";

const { Title } = Typography;
const { Option } = Select;

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  platform: string;
  publishDate: string;
  personName?: string;
  source?: string;
}

type RawScanError =
  | string
  | {
      scannerName?: string;
      errorMessage?: string;
    };

function pickFirst<T>(...vals: (T | undefined | null)[]) {
  for (const v of vals) if (v !== undefined && v !== null) return v as T;
  return undefined as unknown as T;
}

function normalizeError(e: RawScanError) {
  if (typeof e === "string") return { scanner: undefined as string | undefined, message: e };

  const scanner = pickFirst<string>(
    e.scannerName
  );
  const messageTxt =
    pickFirst<string>(
      e.errorMessage
    ) ?? "Bilinmeyen hata";

  return { scanner, message: messageTxt };
}

const labelForScanner = (name?: string) =>
  name ? (scannerDisplayMap as Record<string, string>)[name] ?? name : "Bilinmiyor";

export default function ManageScan() {
  const [scanners, setScanners] = useState<string[]>([]);
  const [selectedScanners, setSelectedScanners] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<ContentItem[]>([]);
  const [errors, setErrors] = useState<Array<ReturnType<typeof normalizeError>>>([]);
  const [loading, setLoading] = useState(false);

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      message.error("Bu sayfaya erişim yetkiniz yok.");
      navigate("/homepage");
    } else {
      fetchScanners();
    }
  }, [isAdmin]);

  const fetchScanners = async () => {
    try {
      const response = await api.get("/scan/scanners");
      setScanners(response.data || []);
    } catch {
      message.error("Scanner listesi alınamadı.");
    }
  };

  const hydrateFromData = (data: any) => {
    const contents: ContentItem[] =
      data?.newContents ?? data?.NewContents ?? data?.contents ?? data?.Contents ?? [];
    const errs: RawScanError[] = data?.errors ?? data?.Errors ?? [];

    setResults(contents ?? []);
    setErrors((errs ?? []).map(normalizeError));
  };

  const handleScan = async () => {
    if (!keyword || selectedScanners.length === 0) {
      message.warning("Lütfen keyword ve en az bir scanner seçin.");
      return;
    }

    setLoading(true);
    setResults([]);
    setErrors([]);

    let data: any | undefined;

    try {
      const response = await api.post("/scan", {
        SearchKeyword: keyword,
        ScannerRunCriteria: selectedScanners,
      });
      data = response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data) {
        data = err.response.data;
      } else {
        message.error("Scan işlemi sırasında beklenmeyen bir hata oluştu.");
      }
    } finally {
      if (data) hydrateFromData(data);
      setLoading(false);
    }
  };

  const columns = [
    { title: "Başlık", dataIndex: "title" },
    { title: "Platform", dataIndex: "platform" },
    { title: "Kaynak", dataIndex: "source" },
    {
      title: "Tarih",
      dataIndex: "publishDate",
      render: (val: string) => (val ? new Date(val).toLocaleString() : "-"),
    },
    {
      title: "Link",
      dataIndex: "url",
      render: (val: string) => (
        <a href={val} target="_blank" rel="noreferrer">
          Git
        </a>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Scan Yönetimi</Title>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Search keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          mode="multiple"
          placeholder="Scanner seçin"
          value={selectedScanners}
          onChange={(values) => setSelectedScanners(values)}
          style={{ width: 350, minWidth: 200 }}
          maxTagCount="responsive"
          dropdownStyle={{ maxHeight: 280, overflowY: "auto" }}
          optionFilterProp="label"
        >
          {scanners.map((s) => (
            <Option key={s} value={s} label={labelForScanner(s)}>
              <Tag color="blue">{labelForScanner(s)}</Tag>
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleScan}>
          Tara
        </Button>
      </div>

      {errors.length > 0 && (
        <Alert
          style={{ marginBottom: 16 }}
          type="warning"
          showIcon
          message={`Bazı taramalar hata verdi (${errors.length})`}
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {errors.map((e, idx) => (
                <li key={idx}>
                  <strong>{labelForScanner(e.scanner)}</strong> hata: {e.message}
                </li>
              ))}
            </ul>
          }
        />
      )}

      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={results}
          rowKey="id"
          columns={columns}
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}
