export function shuffleArray<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let currentIndex = arr.length;

  const seededRandom = (s: string, index: number) => {
    const hash = s.split("").reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, index);
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(
      seededRandom(seed, currentIndex) * currentIndex,
    );
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function calculateTimeRemaining(mustSubmitBy: string): number {
  const deadline = new Date(mustSubmitBy).getTime();
  const now = Date.now();
  const remaining = Math.max(0, deadline - now);
  return Math.floor(remaining / 1000);
}

export function isInputElement(target: EventTarget | null): boolean {
  if (!target) return false;
  const element = target as HTMLElement;
  const tagName = element.tagName?.toUpperCase();
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    element.isContentEditable ||
    element.closest("input") !== null ||
    element.closest("textarea") !== null ||
    element.closest('[contenteditable="true"]') !== null
  );
}

export function createViolationHandlers(
  incrementViolation: (action: string) => void,
) {
  const handleCopy = (e: ClipboardEvent) => {
    if (isInputElement(e.target)) {
      return;
    }
    e.preventDefault();
    incrementViolation("Copy Attempt");
  };

  const handleCut = (e: ClipboardEvent) => {
    if (isInputElement(e.target)) {
      return;
    }
    e.preventDefault();
    incrementViolation("Cut Attempt");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isInputElement(e.target)) {
      return;
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "c" ||
        e.key === "C" ||
        e.key === "x" ||
        e.key === "X" ||
        e.key === "v" ||
        e.key === "V" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "p" ||
        e.key === "P" ||
        e.key === "s" ||
        e.key === "S")
    ) {
      e.preventDefault();
      if (e.key === "c" || e.key === "C") {
        incrementViolation("Ctrl+C Copy Attempt");
      } else if (e.key === "x" || e.key === "X") {
        incrementViolation("Ctrl+X Cut Attempt");
      } else if (e.key === "v" || e.key === "V") {
        incrementViolation("Ctrl+V Paste Attempt");
      } else if (e.key === "a" || e.key === "A") {
        incrementViolation("Ctrl+A Select All Attempt");
      } else if (e.key === "p" || e.key === "P") {
        incrementViolation("Ctrl+P Print Attempt");
      } else if (e.key === "s" || e.key === "S") {
        incrementViolation("Ctrl+S Save Attempt");
      }
    }

    if (
      e.key === "F12" ||
      ((e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "i" || e.key === "I"))
    ) {
      e.preventDefault();
      incrementViolation("DevTools Access Attempt");
    }

    if (e.key === "PrintScreen") {
      e.preventDefault();
      incrementViolation("Screenshot Attempt");
    }
  };

  const handleSelectStart = (e: Event) => {
    if (isInputElement(e.target)) {
      return;
    }
    e.preventDefault();
  };

  return {
    handleCopy,
    handleCut,
    handleKeyDown,
    handleSelectStart,
  };
}

export function injectAntiCopyStyles() {
  const style = document.createElement("style");
  style.id = "quiz-no-select";
  style.innerHTML = `
    .quiz-content {
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }
    .quiz-content input,
    .quiz-content textarea,
    .quiz-content [contenteditable="true"] {
      user-select: text !important;
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
    }
  `;
  document.head.appendChild(style);
}

export function removeAntiCopyStyles() {
  const styleElement = document.getElementById("quiz-no-select");
  if (styleElement) {
    styleElement.remove();
  }
}
