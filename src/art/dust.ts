// The stardust burst of one step: the page measures the leaving and entering copy once, the canvas plays it.
export const DUST_RECTS = 12;

export type DustBurst = {
  // performance.now() when the step started; -Infinity while idle.
  startedAt: number;
  direction: 1 | -1;
  // DUST_RECTS × (left, top, right, bottom) in CSS px, plus each rect's cumulative share of the particles.
  exit: Float32Array<ArrayBuffer>;
  exitShare: Float32Array<ArrayBuffer>;
  enter: Float32Array<ArrayBuffer>;
  enterShare: Float32Array<ArrayBuffer>;
  hasExit: boolean;
  hasEnter: boolean;
};

type Box = { left: number; top: number; right: number; bottom: number };

export function createBurst(): DustBurst {
  return {
    startedAt: -Infinity,
    direction: 1,
    exit: new Float32Array(DUST_RECTS * 4),
    exitShare: new Float32Array(DUST_RECTS),
    enter: new Float32Array(DUST_RECTS * 4),
    enterShare: new Float32Array(DUST_RECTS),
    hasExit: false,
    hasEnter: false,
  };
}

// How far an element's lines are drifted right now (an entering line starts offset), summed up to `root`.
function driftOf(element: Element | null, root: Element): number {
  let drift = 0;
  for (let node = element; node; node = node.parentElement) {
    const transform = getComputedStyle(node).transform;
    if (transform !== "none") drift += new DOMMatrixReadOnly(transform).m42;
    if (node === root) break;
  }
  return drift;
}

function push(boxes: Box[], rect: DOMRect, drift: number) {
  if (rect.width > 0 && rect.height > 0)
    boxes.push({
      left: rect.left,
      top: rect.top - drift,
      right: rect.right,
      bottom: rect.bottom - drift,
    });
}

// One box per line of text (not the full-width block it sits in), and the whole box for filled pills and tags.
function textBoxes(root: Element): Box[] {
  const boxes: Box[] = [];
  for (const filled of root.querySelectorAll("[data-dust-box]"))
    push(boxes, filled.getBoundingClientRect(), driftOf(filled, root));
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!node.textContent?.trim() || parent?.closest("[data-dust-box]"))
      continue;
    const drift = driftOf(parent, root);
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) push(boxes, rect, drift);
  }
  return boxes;
}

const overlap = (a0: number, a1: number, b0: number, b1: number) =>
  Math.min(a1, b1) - Math.max(a0, b0);

// Letters and words on one line join into a line box, and the katakana's stacked glyphs into a column.
function joins(a: Box, b: Box): boolean {
  const height = Math.min(a.bottom - a.top, b.bottom - b.top);
  const width = Math.min(a.right - a.left, b.right - b.left);
  const sameLine =
    overlap(a.top, a.bottom, b.top, b.bottom) > height * 0.5 &&
    -overlap(a.left, a.right, b.left, b.right) < height * 4;
  const glyphs =
    a.right - a.left < (a.bottom - a.top) * 1.6 &&
    b.right - b.left < (b.bottom - b.top) * 1.6;
  const sameColumn =
    glyphs &&
    overlap(a.left, a.right, b.left, b.right) > width * 0.5 &&
    -overlap(a.top, a.bottom, b.top, b.bottom) < width * 0.6;
  return sameLine || sameColumn;
}

function lineBoxes(section: Element): Box[] {
  const lines: Box[] = [];
  for (const root of section.querySelectorAll("[data-dust]")) {
    for (const box of textBoxes(root)) {
      const line = lines.find((other) => joins(other, box));
      if (!line) {
        lines.push(box);
        continue;
      }
      line.left = Math.min(line.left, box.left);
      line.top = Math.min(line.top, box.top);
      line.right = Math.max(line.right, box.right);
      line.bottom = Math.max(line.bottom, box.bottom);
    }
  }
  const area = (box: Box) => (box.right - box.left) * (box.bottom - box.top);
  return lines.sort((a, b) => area(b) - area(a)).slice(0, DUST_RECTS);
}

function collect(
  section: Element | null,
  rects: Float32Array,
  share: Float32Array,
): boolean {
  rects.fill(0);
  share.fill(1);
  if (!section) return false;
  const boxes = lineBoxes(section);
  if (boxes.length === 0) return false;

  // Weighted by the square root of the area, so a short line still sheds some dust next to a big heading.
  const weights = boxes.map((box) =>
    Math.sqrt((box.right - box.left) * (box.bottom - box.top)),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let running = 0;
  boxes.forEach((box, index) => {
    rects.set([box.left, box.top, box.right, box.bottom], index * 4);
    running += weights[index] / total;
    share[index] = index === boxes.length - 1 ? 1 : running;
  });
  return true;
}

export function startBurst(burst: DustBurst, direction: 1 | -1) {
  const leaving = document.querySelector("main [data-stage-section][inert]");
  const entering = document.querySelector(
    "main [data-stage-section]:not([inert])",
  );
  burst.hasExit = collect(leaving, burst.exit, burst.exitShare);
  burst.hasEnter = collect(entering, burst.enter, burst.enterShare);
  burst.direction = direction;
  burst.startedAt = performance.now();
}
