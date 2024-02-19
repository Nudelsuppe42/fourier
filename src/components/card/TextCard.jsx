import { Card, Text } from "@mantine/core";

export function TextCard(props) {
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
      <Text fz="lg" fw={500}>
        {props.value}
      </Text>
    </Card>
  );
}
