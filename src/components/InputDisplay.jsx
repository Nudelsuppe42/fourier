import { Badge, Table, Text } from "@mantine/core";

import { IconWaveSine } from "@tabler/icons-react";

export function InputDisplay({ graph, asFormular }) {
  if (asFormular) {
    let strRaw = [];
    let strClean = [];
    graph.forEach((v) => {
      strRaw.push(`${v[1]}*sin(2*${v[0]}π*x)`);
      strClean.push(`${v[1] === 1 ? "" : v[1] + "*"}sin(${2 * v[0]}π*x)`);
    });
    return (
      <>
        <Text span inherit>
          f(x) = {strRaw.join("+")}
        </Text>
        <br />
        <Text span inherit>
          {" "}
          f(x) = {strClean.join("+")}
        </Text>
      </>
    );
  }

  return (
    <Table h="80%">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            <IconWaveSine />
          </Table.Th>
          {graph.map((_v, i) => (
            <Table.Th key={`n_${i}`}>{i + 1}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Freq.</Table.Td>
          {graph.map((v, i) => (
            <Table.Td key={`f_${i}`}>
              <Badge color="green" size="lg">
                {v[0]}
              </Badge>
            </Table.Td>
          ))}
        </Table.Tr>
        <Table.Tr>
          <Table.Td>Amp.</Table.Td>
          {graph.map((v, i) => (
            <Table.Td key={`a_${i}`}>
              <Badge color="green" size="lg">
                {v[1]}
              </Badge>
            </Table.Td>
          ))}
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
