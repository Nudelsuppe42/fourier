import { Badge, Grid, Group, Paper, Stack, Text } from "@mantine/core";

import Graph from "../Graph";
import { InputDisplay } from "../InputDisplay";

export function FourierScreen({
  gameGraph,
  gameSettings,
  graphData,
  gameWinner,
  gameClients,
}) {
  if (gameGraph.length <= 0) {
    return (
      <>
        <h2>Fourier Graph</h2>
        <p>Waiting for data...</p>
      </>
    );
  }
  return (
    <>
      <Grid>
        <Grid.Col span={12}>
          <h2>Fourier Graph</h2>
        </Grid.Col>
        <Grid.Col span={8}>
          <Paper withBorder p="md" radius="md">
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              All Players
            </Text>
            <Graph
              data={graphData}
              series={Object.keys(graphData[0])
                .filter((k) => k !== "x")
                .map((key, index) => ({
                  name: key,
                  color:
                    key === "y"
                      ? "green.6"
                      : gameClients.find((c) => c.name === key).color || "red",
                  label: key === "y" ? "Solution" : key,
                }))}
              style={{
                height: "400px",
                width: "100%",
              }}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack h="100%">
            <Paper withBorder p="md" radius="md" h="100%">
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs" mb="sm">
                Input Solution
              </Text>
              <InputDisplay graph={gameGraph} />
            </Paper>
            <Paper withBorder p="md" radius="md">
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs" mb="sm">
                Input Formular
              </Text>
              <Text fw={700}>
                <InputDisplay graph={gameGraph} asFormular />
              </Text>
            </Paper>
            <Paper withBorder p="md" radius="md">
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs" mb="sm">
                Legend
              </Text>
              <Group>
                <Badge color="green" size="lg" variant="dot">
                  Solution
                </Badge>
                {gameClients
                  .filter((c) => !c.isSpectator)
                  .map((client) => (
                    <Badge
                      key={client.id}
                      color={client.color}
                      size="lg"
                      variant="dot"
                    >
                      {client.name}
                    </Badge>
                  ))}
              </Group>
            </Paper>
          </Stack>
        </Grid.Col>
        <Grid.Col span={12}>
          <h2>Player Graphs</h2>
        </Grid.Col>
        {gameClients
          .filter((c) => !c.isSpectator)
          .map((client) => (
            <Grid.Col span={6}>
              <Paper withBorder p="md" radius="md">
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                  {client.name}
                </Text>
                <Graph
                  data={graphData.map((d) => ({
                    x: d.x,
                    y: d.y,
                    [client.name]: d[client.name],
                  }))}
                  series={[
                    {
                      name: "y",
                      color: "green.6",
                      label: "Solution",
                    },
                    {
                      name: client.name,
                      color: client.color,
                      label: client.name,
                    },
                  ]}
                  style={{
                    height: "400px",
                    width: "100%",
                  }}
                />
              </Paper>
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
}
