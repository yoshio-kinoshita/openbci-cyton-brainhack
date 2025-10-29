import { parse } from 'csv-parse/sync';

export type BoardType = 'cyton' | 'cyton-daisy';

export interface OpenBciCsvSummary {
  boardType: BoardType;
  sampleRateHz: number | null;
  channelCount: number;
  auxChannelCount: number;
  durationSeconds: number | null;
  rowCount: number;
  channelLabels: string[];
  auxChannelLabels: string[];
  metadata: Record<string, string>;
}

export interface ColumnStats {
  column: string;
  min: number | null;
  max: number | null;
  mean: number | null;
}

export interface OpenBciCsvParseResult {
  summary: OpenBciCsvSummary;
  preview: {
    headers: string[];
    rows: Array<Array<string | number | null>>;
  };
  channelStats: ColumnStats[];
}

const PREVIEW_LIMIT = 20;
const STATS_SAMPLE_LIMIT = 2000;

const isCommentLine = (line: string) => line.trimStart().startsWith('%');

const parseMetadata = (lines: string[]): Record<string, string> => {
  const metadataEntries = lines
    .filter(isCommentLine)
    .map((line) => line.replace(/^%+/, '').trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) {
        return null;
      }
      return [key.trim().toLowerCase(), rest.join(':').trim()] as [string, string];
    })
    .filter((entry): entry is [string, string] => Boolean(entry));

  return Object.fromEntries(metadataEntries);
};

const coerceValue = (value: string): string | number | null => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const numeric = Number(trimmed);
  return Number.isNaN(numeric) ? trimmed : numeric;
};

const determineBoardType = (channelLabels: string[], metadata: Record<string, string>): BoardType => {
  if (channelLabels.length > 8) {
    return 'cyton-daisy';
  }
  const boardMeta = metadata.board ?? metadata['board type'];
  if (boardMeta?.toLowerCase().includes('daisy')) {
    return 'cyton-daisy';
  }
  return 'cyton';
};

const extractSampleRate = (metadata: Record<string, string>): number | null => {
  const rateString = metadata['sample rate'] ?? metadata['sample rate hz'];
  if (!rateString) {
    return null;
  }
  const parsed = Number(rateString);
  return Number.isNaN(parsed) ? null : parsed;
};

const detectTimestampKey = (headers: string[]): string | undefined => {
  return headers.find((header) => {
    const normalized = header.trim().toLowerCase();
    return normalized.startsWith('timestamp') || normalized.includes('time');
  });
};

const computeDuration = (records: Record<string, string>[], timestampKey?: string): number | null => {
  if (!timestampKey || records.length < 2) {
    return null;
  }

  const first = Number(records[0][timestampKey]);
  const last = Number(records[records.length - 1][timestampKey]);

  if (Number.isNaN(first) || Number.isNaN(last)) {
    return null;
  }

  return Math.max(0, last - first);
};

const computeColumnStats = (
  column: string,
  records: Record<string, string>[],
): ColumnStats => {
  const values = records
    .map((row) => Number(row[column]))
    .filter((value) => !Number.isNaN(value));

  if (values.length === 0) {
    return { column, min: null, max: null, mean: null };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((acc, value) => acc + value, 0);

  return {
    column,
    min,
    max,
    mean: sum / values.length,
  };
};

export const parseOpenBciCsv = (fileContents: string): OpenBciCsvParseResult => {
  const normalized = fileContents.replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new Error('CSVファイルにデータが含まれていません。');
  }

  const metadata = parseMetadata(lines);
  const headerLineIndex = lines.findIndex((line) => !isCommentLine(line));

  if (headerLineIndex === -1) {
    throw new Error('CSVヘッダーが見つかりませんでした。');
  }

  const headerLine = lines[headerLineIndex];
  const headerColumns = headerLine.split(',').map((column) => column.trim());

  const dataLines = lines.slice(headerLineIndex + 1);

  if (dataLines.length === 0) {
    throw new Error('CSVデータ行が見つかりません。');
  }

  const records = parse([headerLine, ...dataLines].join('\n'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const previewRows = records.slice(0, PREVIEW_LIMIT).map((row) =>
    headerColumns.map((column) => coerceValue(row[column] ?? '')),
  );

  const statsSample = records.slice(0, STATS_SAMPLE_LIMIT);

  const channelLabels = headerColumns.filter((column) =>
    column.toLowerCase().includes('exg channel'),
  );

  const auxChannelLabels = headerColumns.filter((column) => {
    const normalized = column.toLowerCase();
    return normalized.includes('aux') || normalized.includes('accel') || normalized.includes('analog');
  });

  const boardType = determineBoardType(channelLabels, metadata);
  const sampleRateHz = extractSampleRate(metadata);
  const timestampKey = detectTimestampKey(headerColumns);
  const durationSeconds = computeDuration(records, timestampKey);

  const channelStats = channelLabels.map((column) => computeColumnStats(column, statsSample));

  return {
    summary: {
      boardType,
      sampleRateHz,
      channelCount: channelLabels.length,
      auxChannelCount: auxChannelLabels.length,
      durationSeconds,
      rowCount: records.length,
      channelLabels,
      auxChannelLabels,
      metadata,
    },
    preview: {
      headers: headerColumns,
      rows: previewRows,
    },
    channelStats,
  };
};
