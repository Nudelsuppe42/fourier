let lastIdx = -1;

export function randomColor() {
  if (lastIdx >= 10) {
    lastIdx = 0;
  } else {
    lastIdx = lastIdx + 1;
  }

  return [
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "lime",
    "yellow",
    "orange",
  ][lastIdx];
}
