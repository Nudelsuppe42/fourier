import { Center, Stack } from "@mantine/core";

export function WinnerScreen({ winner, settings, graph, clients }) {
  return (
    <Center h="100vh">
      <Stack ta="center">
        <h1>Game Over</h1>
        <h3>Winner: {winner}</h3>
      </Stack>
    </Center>
  );
}
