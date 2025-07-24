import type Quill from "quill"; // Import type only

let ctrlShiftAPressed = false;
let editorInstances: Quill[] = []; // ✅ Explicit type

export function setCtrlShiftAPressed(val: boolean): void {
  ctrlShiftAPressed = val;
}

export function getCtrlShiftAPressed(): boolean {
  return ctrlShiftAPressed;
}

export function setEditorInstances(refs: Quill[]): void {
  editorInstances = refs;
}

export function getEditorInstances(): Quill[] {
  return editorInstances;
}

export const clearHighlight = (editor: any) => {
  const length = editor.getLength();
  editor.formatText(0, length - 1, { background: false }, "user");
};

function clearAllHighlights() {
  const editors = getEditorInstances();
  editors.forEach(editor => {
    const len = editor.getLength();
    editor.formatText(0, len, { background: false }, "user");
  });

  // Clean up event listeners (once cleared)
  document.removeEventListener("mousedown", onAnyUserAction);
  document.removeEventListener("keydown", onAnyUserAction);
}

function onAnyUserAction() {
  clearAllHighlights();
}

export function setupGlobalHighlightClearListener() {
  // Add once to global document to catch any interaction
  document.addEventListener("mousedown", onAnyUserAction);
  document.addEventListener("keydown", onAnyUserAction);
}
