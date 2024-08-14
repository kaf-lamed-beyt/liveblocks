import { formatFileSize } from "../utils/format-file-size";

describe("formatFileSize", () => {
  test.each([
    [0, "0 KB"],
    [1, "0.01 KB"],
    [4, "0.01 KB"],
    [10, "0.01 KB"],
    [40, "0.04 KB"],
    [102, "0.1 KB"],
    [500, "0.5 KB"],
    [950, "0.9 KB"],
    [1024, "1 KB"],
    [9.5 * 1024, "9.5 KB"],
    [10 * 1024, "10 KB"],
    [106.8 * 1024, "107 KB"],
    [865.4 * 1024, "865 KB"],
    [1024 * 1024, "1 MB"],
    [16.2 * 1024 * 1024, "16.2 MB"],
    [1024 * 1024 * 1024, "1 GB"],
    [32.5 * 1024 * 1024 * 1024, "32.5 GB"],
    [1124 * 1024 * 1024 * 1024, "1,124 GB"],
  ])("should format %d bytes as %s", (size, expected) => {
    expect(formatFileSize(size, "en-US")).toBe(expected);
  });
});