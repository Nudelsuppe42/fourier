import { Card, Text } from "@mantine/core";

export function ClearCard(props) {
  return (
    <Card
      withBorder
      padding="lg"
      bg="var(--mantine-color-body)"
      h={props.height}
      w={props.width}
    >
      <Text fz="xs" tt="uppercase" fw={700} c="dimmed" mb="md">
        {props.title}
      </Text>
      {props.children}
    </Card>
  );
}
