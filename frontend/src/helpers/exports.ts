// https://github.com/vanillaes/csv
const stringify = (data: unknown[][]) => {
  const needsDelimiters = /"|,|\r\n|\n|\r/;

  const rows = data.map((row) => {
    const cells = row.map((cell) => {
      if (typeof cell === "string") {
        cell = cell.replace(/"/g, '""');
        cell = needsDelimiters.test(cell as string) ? `"${cell}"` : cell;
      }

      return cell;
    });

    return cells.join(",");
  });

  return rows.join("\n");
};

export const exportAsCSV = (
  header: string[],
  data: unknown[][],
  filename: string,
) => {
  const csvData = stringify([header, ...data]);

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
