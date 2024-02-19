/* eslint-disable no-unused-vars */
/* eslint-disable no-sparse-arrays */
import {
  Alert,
  AppShell,
  Avatar,
  Badge,
  Grid,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import React, { useState } from "react";

import Graph from "./components/Graph";
import { ClearCard } from "./components/card/ClearCard";
import { TextCard } from "./components/card/TextCard";

function App() {
  let ws = new WebSocket("ws://192.168.178.55:8080/fouriercomm");

  const [gameSettings, setGameSettings] = useState({
    data: {},
    graph: [],
    clients: {},
  });
  const [running, setRunning] = useState(false);
  // const [connectedClients, setConnectedClients] = useState({data:{}});

  ws.onopen = (event) => {
    console.log("connected", event);

    ws.send(JSON.stringify({ connectedClients: "hallo" }));
  };

  ws.onclose = (event) => {
    console.log("disconnected", event);
  };

  ws.onmessage = (event) => {
    const json = JSON.parse(event.data);
    const updatedGameSettings = gameSettings;

    if (json.gameData?.settings) {
      setRunning(true);
      updatedGameSettings.data = JSON.parse(json.gameData.settings);
      setGameSettings(updatedGameSettings);
      console.log("New Settings");
    }

    if (json.gameData?.init && Array.isArray(json.gameData?.init)) {
      setRunning(true);
      updatedGameSettings.graph = json.gameData?.init;

      setGameSettings(updatedGameSettings);
      console.log("New Graph", json.gameData?.init);
    }

    if (json?.connectedClients) {
      setRunning(true);
      updatedGameSettings.clients = json.connectedClients;
      // setConnectedClients(json.connectedClients);
      console.log(json.connectedClients);
    }

    console.log("Recived: ", json);
    setGameSettings(updatedGameSettings);
  };

  ws.addEventListener("error", (event) => {
    console.log("WebSocket error: ", event);
  });

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <h2>Active Users</h2>
        <Stack>
          {["Kanonel", "Nudelsuppe_42", "Carl das Lama"].map((user) => (
            <Group gap="sm" key={user}>
              <Avatar size={40} radius={40} color="grape">
                {user[0].toUpperCase()}
              </Avatar>
              <div>
                <Text fz="sm" fw={500}>
                  {user}
                </Text>
              </div>
            </Group>
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <h2>Fourier Settings</h2>
        {!running ? (
          <Alert title="Status">Noch kein Spiel gestartet</Alert>
        ) : (
          <Grid columns={20}>
            <Grid.Col span={4}>
              <TextCard
                title="Number of Sins"
                value={gameSettings.data.sinNumber}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextCard
                title="Values"
                value={`${gameSettings.data.minValue} - ${gameSettings.data.maxValue}`}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextCard title="Steps" value={gameSettings.data.valueSteps} />
            </Grid.Col>
            <Grid.Col span={4}>
              <ClearCard title="Zeros included" height="100%">
                {gameSettings.data.includeZeros ? (
                  <Badge color="green" variant="light">
                    Enabled
                  </Badge>
                ) : (
                  <Badge color="red" variant="light">
                    Disabled
                  </Badge>
                )}
              </ClearCard>
            </Grid.Col>
            <Grid.Col span={4}>
              <ClearCard title="Input hints" height="100%">
                {gameSettings.data.inputHints ? (
                  <Badge color="green" variant="light">
                    Enabled
                  </Badge>
                ) : (
                  <Badge color="red" variant="light">
                    Disabled
                  </Badge>
                )}
              </ClearCard>
            </Grid.Col>
          </Grid>
        )}

        <h2>Fourier Graphs</h2>
        {gameSettings.graph.length > 0 && (
          <Graph
            data={gameSettings.graph}
            settings={gameSettings.data}
            style={{ height: "400px", width: "100%" }}
          />
        )}
        <pre>{JSON.stringify(gameSettings, null, 2)}</pre>
        <p>{ws.readyState}</p>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
