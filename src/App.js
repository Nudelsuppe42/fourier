/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-sparse-arrays */
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  AppShell,
  Avatar,
  Center,
  Divider,
  Group,
  JsonInput,
  Loader,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Graph, { dataForMultiple } from "./components/Graph";

import { getHotkeyHandler } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { InputDisplay } from "./components/InputDisplay";
import { FourierScreen } from "./components/game/FourierScreen";
import { WinnerScreen } from "./components/game/WinnerScreen";
import { randomColor } from "./util/Color";

function App() {
  // Websocket State
  const [socketUrl, setSocketUrl] = useState(
    "ws://192.168.178.55:8080/fouriercomm"
  );
  const [messageHistory, setMessageHistory] = useState([]);
  const {
    sendMessage,
    lastJsonMessage,
    sendJsonMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: (e) => {
      showNotification({ message: "Websocket connected", color: "green" });
      setMessageHistory([]);
    },
    onClose: (e) =>
      showNotification({ message: "Websocket disconnected", color: "yellow" }),
    onError: (e) =>
      showNotification({ message: "Websocket error", color: "red" }),
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing...",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  // Game State
  const [clientName, setClientName] = useState("Spectator");
  const [gameRunning, setGameRunning] = useState(false);
  const [gameSettings, setGameSettings] = useState({});
  const [gameGraph, setGameGraph] = useState([]);
  const [gameClients, setGameClients] = useState([]);
  const [gameWinner, setGameWinner] = useState(null);
  const [uiSettings, setUiSettings] = useState({
    logs: false,
  });
  const [graphData, setGraphData] = useState([]);

  // Message Handler
  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
    }

    // Initial request for client details
    if (lastJsonMessage?.properties === "none") {
      sendJsonMessage({
        properties: { name: clientName, isSpectator: true },
      });

      sendJsonMessage({ connectedClients: "fetch" });
    }

    // Client List
    if (lastJsonMessage?.connectedClients) {
      const lastClients = gameClients;
      setGameClients(
        lastJsonMessage.connectedClients.map((c) => ({
          ...c,
          graph: lastClients.find((cl) => cl.name === c.name)?.graph || [],
          color:
            lastClients.find((cl) => cl.name === c.name)?.color ||
            randomColor(),
        }))
      );
      console.log(gameClients);
    }

    // Game Start
    if (lastJsonMessage?.gameselection === "fourier") {
      setGameRunning(true);
      setGameClients((prev) => prev.map((c) => ({ ...c, graph: [] })));
      setGameWinner(null);
    }
    // Game Graph
    if (
      lastJsonMessage?.gameData?.init &&
      Array.isArray(lastJsonMessage?.gameData?.init)
    ) {
      setGameRunning(true);
      setGameGraph(lastJsonMessage.gameData.init);

      setGameClients(
        gameClients.map((c) => ({
          ...c,
          graph: new Array(gameGraph.length).fill([0, 0]),
        }))
      );
    }

    // Game Settings
    if (lastJsonMessage?.gameData?.settingsJson) {
      setGameRunning(true);
      setGameSettings(lastJsonMessage?.gameData.settingsJson);
    }

    // Game Update
    if (lastJsonMessage?.update) {
      const obj = lastJsonMessage?.update;
      let clientIndex = gameClients.findIndex(
        (c) => c.id === lastJsonMessage?.hash
      );

      const updatedGameClients = [...gameClients];

      if (
        obj.sinNum < 0 ||
        obj.sinNum >= gameClients[clientIndex].graph.length ||
        obj.valueNum < 0 ||
        obj.valueNum >= gameClients[clientIndex].graph[0].length
      ) {
        updatedGameClients[clientIndex].graph = new Array(
          gameGraph.length
        ).fill([0, 0]);
      }
      updatedGameClients[clientIndex].graph[obj.sinNum] =
        obj.valueNum === 0
          ? [obj.newValue, updatedGameClients[clientIndex].graph[obj.sinNum][1]]
          : [
              updatedGameClients[clientIndex].graph[obj.sinNum][0],
              obj.newValue,
            ];

      setGameClients(updatedGameClients);
    }

    // Game Winner
    if (lastJsonMessage?.gameData?.winner) {
      setGameRunning(false);
      setGameWinner(lastJsonMessage?.gameData?.winner);
    }
  }, [lastJsonMessage, setMessageHistory, sendJsonMessage]);

  useEffect(() => {
    if (gameGraph && !gameWinner) {
      const data = { y: gameGraph };
      gameClients.forEach((client) => {
        if (!client.isSpectator) {
          data[client.name] = client.graph || [];
        }
      });
      setGraphData(dataForMultiple(data, gameSettings.maxValue));
    }
  }, [gameClients, gameGraph, gameSettings]);

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
      color="red"
    >
      <AppShell.Navbar
        p="md"
        style={{
          overflow: "hidden",
        }}
      >
        <h2>Active Users</h2>
        <Stack>
          {gameClients.length > 0 &&
            gameClients
              .sort(
                (b, a) =>
                  (b.isSpectator && !a.isSpectator) -
                  (!b.isSpectator && a.isSpectator)
              )
              .map((client) => (
                <Group gap="sm" key={client.id}>
                  <Avatar
                    size={40}
                    radius={40}
                    color={client.isSpectator ? "gray" : client.color || "red"}
                  >
                    {client?.name[0].toUpperCase()}
                  </Avatar>
                  <div>
                    <Text fz="sm" fw={500} lineClamp={1}>
                      {client.name}
                    </Text>
                    <Text fz="xs" fw={500} c="dimmed">
                      {client.id}
                    </Text>
                  </div>
                </Group>
              ))}
        </Stack>
        <Accordion mt="xl">
          <AccordionItem value="settings">
            <AccordionControl>Settings</AccordionControl>
            <AccordionPanel>
              <TextInput
                readOnly
                value={connectionStatus}
                label="Websocket Status"
              />
              <TextInput
                label="Websocket IP"
                mt="md"
                defaultValue={socketUrl.replace("/fouriercomm", "")}
                onKeyDown={getHotkeyHandler([
                  [
                    "Enter",

                    (event) =>
                      setSocketUrl(event.target.value + "/fouriercomm"),
                  ],
                ])}
              />
              <TextInput
                label="Client Name"
                mt="md"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                onKeyDown={getHotkeyHandler([
                  [
                    "Enter",

                    (event) => {
                      sendJsonMessage({
                        properties: { name: clientName, isSpectator: true },
                      });

                      sendJsonMessage({ connectedClients: "refetch" });
                    },
                  ],
                ])}
              />
              <JsonInput
                label="Send Message"
                mt="md"
                formatOnBlur
                defaultValue={`{"connectedClients":"gib her"}`}
                maxRows={3}
                minRows={1}
                autosize
                onKeyDown={getHotkeyHandler([
                  ["Enter", (event) => sendMessage(event.target.value)],
                ])}
              />
              <Divider my="md" />
              <Switch
                label="Show Logs"
                defaultChecked={uiSettings.logs}
                onChange={(e) =>
                  setUiSettings({ ...uiSettings, logs: e.target.checked })
                }
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: "var(--mantine-color-dark-8)" }}>
        {!gameRunning ? (
          gameWinner ? (
            <WinnerScreen
              winner={gameWinner}
              settings={gameSettings}
              graph={gameGraph}
              clients={gameClients}
            />
          ) : (
            <Center h="100vh">
              <Loader type="bars" />
            </Center>
          )
        ) : (
          <FourierScreen
            gameGraph={gameGraph}
            gameSettings={gameSettings}
            graphData={graphData}
            gameClients={gameClients}
            gameWinner={gameWinner}
          />
        )}

        {uiSettings.logs && (
          <>
            <h2>Fourier Log</h2>
            <ul>
              {messageHistory.map((message, idx) => (
                <li key={idx}>
                  {message ? JSON.stringify(message) : "No Content"}
                </li>
              ))}
            </ul>
          </>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
