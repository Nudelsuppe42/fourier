import { LineChart } from "@mantine/charts";

const GRAPH_WIDTH = 400;
const GRAPH_HEIGHT = 200;

export default function Graph({ data, style, series }) {
  const maxY = Math.max(...data.map((entry) => entry.y)) + 10;
  const minY = Math.min(...data.map((entry) => entry.y)) - 10;
  return (
    <LineChart
      data={data}
      series={series || [{ name: "y", color: "blue.6" }]}
      style={style}
      curveType="natural"
      tickLine="none"
      gridAxis="none"
      withXAxis={false}
      withYAxis={false}
      withDots={false}
      yAxisProps={{ domain: [minY, maxY], allowDataOverflow: true }}
      // h={style?.height}
      // w={style?.width}
      // mih={style?.minHeight}
      // miw={style?.minWidth}
      // lineChartProps={{ height: style?.height, width: style?.width }}
    />
  );
}

export function valueFor(x, data) {
  let output = 0;

  data.forEach((entry) => {
    output = entry[1] * Math.sin(entry[0] * x * 2 * Math.PI) + output;
  });
  return output;
}

export function dataFor(data, maxValue) {
  const resolution = GRAPH_WIDTH / (40 * maxValue);

  const values = [];

  for (let i = 0; i <= GRAPH_WIDTH; i += resolution) {
    values.push({
      y: valueFor(i / GRAPH_WIDTH, data) * (GRAPH_HEIGHT / 2),
      x: i,
    });
  }
  return values;
}

export function dataForMultiple(data, maxValue) {
  const resolution = GRAPH_WIDTH / (40 * maxValue);
  const values = [];

  for (let i = 0; i <= GRAPH_WIDTH; i += resolution) {
    const obj = { x: i };

    Object.keys(data).forEach((k) => {
      obj[k] = valueFor(i / GRAPH_WIDTH, data[k]) * (GRAPH_HEIGHT / 2);
    });

    values.push(obj);
  }
  return values;
}
