/* eslint-disable no-duplicate-case */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable */

import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
  ChangeEvent,
} from "react";

// import

import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";

import { Quill } from "react-quill";
import {
  PdfDocument,
  PdfPageSettings,
  PdfPageOrientation,
  PdfSection,
  PdfBitmap,
  SizeF,
} from "@syncfusion/ej2-pdf-export";
import { registerLicense, select } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2UVhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9nSX1Tc0ViWHZcd3dVRWQ="
);

import * as jQueryLibrary from "jquery"; // Rename the import
const $ = jQueryLibrary;
// other imports...
import {
  Button,
  Grid,
  Typography,
  Box,
  ListItemText,
  ListItemButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  DocumentEditorComponent,
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog,
} from "@syncfusion/ej2-react-documenteditor";

import { ItemModel } from "@syncfusion/ej2-react-splitbuttons";
import { ContractContext } from "@/context/ContractContext";

import "@react-pdf-viewer/core/lib/styles/index.css";
const Delta = Quill.import("delta");
import PDFUploaderViewer from "@/pages/dasboard/contract/PDFUploaderViewer";
import SyncFesionFileDilog from "@/pages/dasboard/contract/sdk/SyncFesionFileDilog";
import {
  create,
  getcontractById,
  updateDocument,
} from "@/service/api/contract";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ReactQuill from "react-quill";
import QuillToolbar, { formats, modules } from "./QuillToolbar";
import TrackChanges from "./TrackChanges";
import DiffMatchPatch, {
  DIFF_INSERT,
  DIFF_DELETE,
  DIFF_EQUAL,
  // @ts-ignore
} from "diff-match-patch";
import { Console } from "console";
import OptionImage from "../../../../assets/options.png";
import EditorFooter from "./EditorFooter";
import { debounce } from "lodash";
DocumentEditorComponent.Inject(
  Selection,
  Editor,
  EditorHistory,
  ContextMenu,
  TableDialog
);

DocumentEditorContainerComponent.Inject(Toolbar);

import CustomOrderedList from './customOrderedList'; // path to your blot;
import CustomAlphaList from './customAlphaBlot';
import { constrainedMemory } from "process";
import { setCtrlShiftAPressed, setupGlobalHighlightClearListener } from './sharedflag';
import { setEditorInstances } from "./sharedflag";


function SyncFesion() {
  const location = useLocation();
  const navigate = useNavigate();
  const templateOpen = location?.state?.templateOpen;
  const { user } = useAuth();
  const { id } = useParams();
  const [documentData, setDocumentData] = useState<string | null>(null);
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const [list, setList] = useState<undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [newId, setNewId] = useState("");
  const {
    setEditorRefContext,
    temlatePoupup,
    setTemlatePoupup,
    dragFields,
    recipients,
    setRecipients,
    uplodTrackFile,
    setUplodTrackFile,
    documentContent,
    setDocumentContent,
    showBlock,
    IsTemplate,
    setShowBlock,
    setApprovers,
    formState,
    setSelectedModule,
    setSidebarExpanded,
    setEditMode,
    editMode,
    lifecycleData,
    setLifecycleData,
    collaborater,
    setCollaborater,
    approvers,
    documentName,
    setDucomentName,
    setLeftSidebarExpanded,
    setFormState,
    inputRef,
    auditTrails,
    setAuditTrails,
    trackChanges,
    setTrackChanges,
    documentPageSize,
    documentPageMargins,
    bgColor,
    fontColor,
    setBgColorSvg,
    setFontColorSvg,
    setFontColor,
    selectionRef,
    setSelectedFontValue,
    selectedFont,
    selectedFontSize,
    setSelectedFontSizeValue,
    setSelectedFontSize,
    setSelectedHeadersValue,
    selectedHeaders,
    setSelectedHeaders,
    pages,
    setPages,
    currentPage,
    setCurrentPage,
    setSpacing,
    bgColorSelection,
    setDocumentPageSize,
    setDocumentPageMargins,
    prevBgColor,
    prevFontColor,
    setPrevBgColor,
    setSelectedFont,
    setPrevFontColor,
    contractNewFont,
    contractNewFontSize,
    contractNewFontStyles,
    setContractNewFont,
    setContractNewFontSize,
    setContractNewFontStyles,
    selectedFontSizeValue,
    selectedFontValue,
    bgColorSvg,
    fontColorSvg
  } = useContext(ContractContext);

  const workerUrl =
    "https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js";
  
  // Create this map outside the event handler (at component/module level)
  const originalFontSizeMap = new Map<any, string>(); // Key: editor instance, Value: original size
  const [formattingVisible, setFormattingVisible] = useState(false);
  const formattingVisibleRef = useRef(formattingVisible);
  const [oldPages, setOldPages] = useState([]);
  const [showTableTools, setShowTableTools] = useState(false);
  // State for the cell fill color
  const [cellFillColor, setCellFillColor] = useState(""); // Default color
  const [editorHtml, setEditorHtml] = useState<any>([""]);
  const [addedString, setAddedString] = useState("");
  const [deletedString, setDeletedString] = useState("");
  const editorRefs: any = useRef<any>([]);
  const containerRefs: any = useRef([]); // Ref for storing page container divs
  const parentContainerRef = useRef(null); // Ref for the parent container
  const [isTableSelected, setIsTableSelected] = useState(false);
  const [selection, setSelection] = useState<any>(null);
  const [comments, setComments] = useState<any>([]);
  const [openComment, SetOpenComment] = useState<boolean>(false);
  const [isFocusedInput, setIsFocusedInput] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isInternal, setIsInternal] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState("");
  const [commentSelection, setCommentSelection] = useState(null);
  const [commentPrevBg, setCommentPrevBg] = useState("");
  const commentInputRef: any = useRef(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isStrikeActive, setIsStrikeActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isScriptActive, setIsScriptActice] = useState("");
  const [isListActive, setIsListActive] = useState("");
  const [toMinus, setToMinus] = useState<number>(0);
  const [commentLeftButton, setCommentLeftButton] = useState("97.8%");
  const [editComment, setEditComment] = useState<boolean>(false);
  const [editCommentIndex, setEditCommmentIndex] = useState<any>(null);
  const [reply, setReply] = useState<any>({});
  const [addSigns, setAddSigns] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const div1Ref = useRef<any>(null);
  const div2Ref = useRef<any>(null);
  const div3Ref = useRef<any>(null);
  const scrollPageRef = useRef<any>(null);

  const [remainingVh, setRemainingVh] = useState(0);
  const [footerWidth ,setFooterWidth ] = useState(0);

  const [documentHeight,setDocumentHeight] = useState(0)

  const [indexComment, setIndexComment] = useState<number>(0);

  useEffect(() => {
    setIsLoading(false);
    setLeftSidebarExpanded(true);
  }, []);

useEffect(() => {
  const quill = editorRefs.current[currentPage]?.getEditor();
  if (!quill) return;

  const editorElement = quill.root;

  const handlePaste = (e:any) => {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');

    // Wait until Quill updates the selection after paste
    setTimeout(() => {
      const selection = quill.getSelection();

      const insertAt = selection?.index ?? quill.getLength(); // fallback to end
      quill.insertText(insertAt, text, {
        font: 'arial',
        size: '13px',
        color: '#000000'
      });

      // Move cursor to end of pasted content
      quill.setSelection(insertAt + text.length, 0);
    }, 0);
  };

  editorElement.addEventListener('paste', handlePaste);
  return () => {
    editorElement.removeEventListener('paste', handlePaste);
  };
}, [currentPage]);




//   useEffect(() => {
//   if (!editorRefs) return;

//   const savedDelta = editorRefs.getContent();
//   console.log("saveddelta", savedDelta);

//   if (savedDelta) {
//     const savedDeltaParsed = JSON.parse(savedDelta);
//     const quill = editorRefContext.getEditor?.();
//     if (quill) {
//       quill.setContents(savedDeltaParsed);
//     }
//   }
// }, []);



  // Keep ref in sync
  useEffect(() => {
    formattingVisibleRef.current = formattingVisible;
  }, [formattingVisible]);

// function patchListStartOnEditor(editor: any) {
//   const ols = editor.root.querySelectorAll('ol');
//   ols.forEach((ol: any) => {
//     const startAttr = ol.getAttribute('start');
//     const start = startAttr ? parseInt(startAttr, 10) : 1;
//     if (!isNaN(start)) {
//       ol.style.setProperty('--custom-start', start - 1);
//       ol.style.setProperty('counter-reset', `list-item ${start - 1}`);
//     }
//   });
// }

// function updateListStylesForAllPages() {
//   editorRefs.current.forEach((editorRefs:any) => {
//     const editor = editorRefs.getEditor();
//     patchListStartOnEditor(editor);
//   });
// }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Only trigger on Ctrl + Shift + a
      if (e.ctrlKey && e.shiftKey && key === 'a') {
        e.preventDefault();
        setCtrlShiftAPressed(true);

        const instances: any[] = [];
        const highlightColor = '#B4D5FF';

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (editor) {
            instances.push(editor);
            const length = editor.getLength();
            editor.formatText(0, length - 1, { background: highlightColor }, "user");
          }
        });

        setEditorInstances(instances);
        setupGlobalHighlightClearListener(); // 🧠 Set once for all
      }
      
      // Only trigger on Ctrl + Shift + B
      if (e.ctrlKey && e.shiftKey && key === 'b') {
        e.preventDefault(); // Prevent any default behavior like browser shortcuts

        console.log('Ctrl + Shift + B detected: applying bold to all editors');

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (editor) {
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isBold = formats.bold === true;
            editor.formatText(0, length, 'bold', !isBold); // Toggle bold
          }
        });
      }

      // Only trigger on Ctrl + Shift + i
      if (e.ctrlKey && e.shiftKey && key === 'i') {
        e.preventDefault(); // Prevent any default behavior like browser shortcuts

        console.log('Ctrl + Shift + i detected: applying italic to all editors');

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (editor) {
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isItalic = formats.italic === true;
            editor.formatText(0, length, 'italic', !isItalic); // Toggle italic
          }
        });
      }

      // Only trigger on Ctrl + Shift + u
      if (e.ctrlKey && e.shiftKey && key === 'u') {
        e.preventDefault(); // Prevent any default behavior like browser shortcuts

        console.log('Ctrl + Shift + u detected: applying underline to all editors');

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (editor) {
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isUnderline = formats.underline === true;
            editor.formatText(0, length, 'underline', !isUnderline); // Toggle underline
          }
        });
      }

      // Only trigger on Ctrl + Shift + x
      if (e.ctrlKey && e.shiftKey && key === 'x') {
        e.preventDefault(); // Prevent any default behavior like browser shortcuts

        console.log('Ctrl + Shift + x detected: applying underline to all editors');

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (editor) {
            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isStrike = formats.strike === true;
            editor.formatText(0, length, 'strike', !isStrike); // Toggle strike
          }
        });
      }

      // Only trigger on Ctrl + Shift + +
      if (e.ctrlKey && e.shiftKey && e.key === '+') {
        e.preventDefault(); // Prevent default browser behavior

        console.log('Ctrl + Shift + + detected: applying superscript to all editors');

        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (!editor) return;

          const length = editor.getLength();
          const formats = editor.getFormat(0, length);
          const isSuperscript = formats.script === "super";

          const currentFormat = editor.getFormat();
          const currentSize = currentFormat.size || selectedFontSizeValue || "14px";

          // Helper: reduce size by 4px
          const getReducedSize = (size: string): string => {
            const pxMatch = size.match(/^(\d+)px$/);
            if (pxMatch) {
              const reduced = Math.max(parseInt(pxMatch[1], 10) - 4, 8);
              return `${reduced}px`;
            }
            return size;
          };

          if (isSuperscript) {
                const getIncreasedSize = (size: string): string => {
                const pxMatch = size.match(/^(\d+)px$/);
                if (pxMatch) {
                  const increased = parseInt(pxMatch[1], 10) + 4;
                  return `${increased}px`;
                }
                return size;
              };

            const originalSize = originalFontSizeMap.get(editor) || getIncreasedSize(currentSize);
            console.log("Restoring for editor:", editor);
            console.log("Original size:", originalSize, "| Current size:", currentSize);

            editor.formatText(0, length, {
              script: false,
              size: originalSize,
            }, 'user');

            originalFontSizeMap.delete(editor);
            setIsScriptActice("");
          } else {
            // Store original size and apply superscript
            if (!originalFontSizeMap.has(editor)) {
              originalFontSizeMap.set(editor, currentSize);
              console.log("Storing original size:", currentSize, "for editor:", editor);
            }

            const reducedSize = getReducedSize(currentSize);
            console.log("Applying reduced size:", reducedSize, "to editor:", editor);

            editor.formatText(0, length, {
              script: 'super',
              size: reducedSize,
            }, 'user');

            setIsScriptActice("super");
          }
        });
      }
      // Only trigger on Ctrl + -
      if (e.ctrlKey && e.key === '-') {
          e.preventDefault(); // Prevent default browser behavior

          console.log('Ctrl + Shift + - detected: applying subscript to all editors');

          editorRefs.current.forEach((ref: any) => {
            const editor = ref?.getEditor();
            if (!editor) return;

            const length = editor.getLength();
            const formats = editor.getFormat(0, length);
            const isSubscript = formats.script === "sub";

            const currentFormat = editor.getFormat();
            const currentSize = currentFormat.size || selectedFontSizeValue || "14px";

            // Helper: reduce size by 4px
            const getReducedSize = (size: string): string => {
              const pxMatch = size.match(/^(\d+)px$/);
              if (pxMatch) {
                const reduced = Math.max(parseInt(pxMatch[1], 10) - 4, 8);
                return `${reduced}px`;
              }
              return size;
            };

            if (isSubscript) {
              // Helper: increase size by 4px
              const getIncreasedSize = (size: string): string => {
                const pxMatch = size.match(/^(\d+)px$/);
                if (pxMatch) {
                  const increased = parseInt(pxMatch[1], 10) + 4;
                  return `${increased}px`;
                }
                return size;
              };

              const originalSize = originalFontSizeMap.get(editor) || getIncreasedSize(currentSize);
              console.log("Restoring for editor:", editor);
              console.log("Original size:", originalSize, "| Current size:", currentSize);

              editor.formatText(0, length, {
                script: false,
                size: originalSize,
              }, 'user');

              originalFontSizeMap.delete(editor);
              setIsScriptActice("");
            } else {
              // Store original size and apply subscript
              if (!originalFontSizeMap.has(editor)) {
                originalFontSizeMap.set(editor, currentSize);
                console.log("Storing original size:", currentSize, "for editor:", editor);
              }

              const reducedSize = getReducedSize(currentSize);
              console.log("Applying reduced size:", reducedSize, "to editor:", editor);

              editor.formatText(0, length, {
                script: 'sub',
                size: reducedSize,
              }, 'user');

              setIsScriptActice("sub");
            }
          });
        }

      // Only trigger on Ctrl + 8
      if (e.ctrlKey && e.key === '8') {
        e.preventDefault();
        editorRefs.current.forEach((ref: any) => {
          const editor = ref?.getEditor();
          if (!editor) return;

          const editorContainer = editor.root;
          const paragraphs = editorContainer.querySelectorAll("p");

          paragraphs.forEach((p: HTMLElement) => {
            const oldMarks = p.querySelectorAll(".formatting-mark");
            oldMarks.forEach((mark) => {
              const parent = mark.parentNode;
              if (!parent) return;

              const textContent = mark.textContent || "";
              const restoredText = textContent
                .replace(/·/g, " ")
                .replace(/→/g, "\t")
                .replace(/¶/g, "");

              const textNode = document.createTextNode(restoredText);
              parent.replaceChild(textNode, mark);
            });

            // ✅ Use ref to access current visibility
            if (!formattingVisibleRef.current) {
              const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
              const textNodes: Text[] = [];

              while (walker.nextNode()) {
                textNodes.push(walker.currentNode as Text);
              }

              textNodes.forEach((textNode) => {
                const originalText = textNode.textContent ?? "";
                const fragment = document.createDocumentFragment();

                for (let i = 0; i < originalText.length; i++) {
                  const char = originalText[i];
                  const span = document.createElement("span");
                  span.className = "formatting-mark";

                  if (char === " " || char === ".") {
                    span.textContent = "·";
                    span.setAttribute("contenteditable", "false");
                  } else if (char === "\t") {
                    span.textContent = "→";
                    span.setAttribute("contenteditable", "false");
                  } else {
                    span.textContent = char;
                  }

                  fragment.appendChild(span);
                }

                textNode.parentNode?.replaceChild(fragment, textNode);
              });

              const endMark = document.createElement("span");
              endMark.className = "formatting-mark";
              endMark.setAttribute("contenteditable", "false");
              endMark.textContent = "¶";
              p.appendChild(endMark);
            }
          });
        });

        // ✅ Proper toggle
        setFormattingVisible(prev => !prev);
      }

      
      if (e.key === ' ') {
        console.log("triggered");
        const focusedEditorIndex = currentPage;
        console.log("focusedEditorIndex", focusedEditorIndex);
        const editor = editorRefs.current[currentPage].getEditor();

        const range = editor.getSelection(true);
        if (!range) return;

        // Get the current line/blot before cursor
        const [block, offset] = editor.scroll.descendant(
          Quill.import('blots/block'),
          range.index - 1
        );
        if (!block) return;

        const text = block.domNode.textContent || '';
        // Remove all whitespace and zero-width spaces to normalize input
        const cleanedText = text.replace(/\s+/g, '').replace(/\u200B/g, '');
        console.log('Cleaned:', JSON.stringify(cleanedText)); 

        if (/^\d+\.$/.test(cleanedText)) {
          const match = cleanedText.match(/^(\d+)\.$/);
          if (match) {
            const startNumber = parseInt(match[1], 10);
            console.log("start: ", startNumber);
            Quill.register(CustomOrderedList, true);

            e.preventDefault();

            // Step 1: Get the formats at the first character of the text being deleted
const currentFormats = editor.getFormat(range.index - text.length, 1);
            // Remove the original typed text (e.g., "1.")
            editor.deleteText(range.index - text.length, text.length);

            editor.formatLine(range.index - text.length, 1, 'list', 'ordered');

            console.log("currentFormats", currentFormats['size']);
            // Reapply font-size
            if (currentFormats['size']) {
              editor.formatText(range.index - text.length, 1, 'size', currentFormats['size']);
            }


            // Insert a space to allow typing after list bullet
            editor.insertText(range.index - text.length, ' ');

            // Set cursor right after the inserted space
            editor.setSelection(range.index - text.length + 1, 0);

            // Patch OL element manually to fix start attribute and CSS variable
            setTimeout(() => {
              const [leaf] = editor.getLeaf(range.index - text.length);
              if (!leaf) return;

              let parent = leaf.parent;
              while (parent && parent.domNode?.tagName !== 'OL') {
                parent = parent.parent;
              }

              if (parent && parent.domNode?.tagName === 'OL') {
                parent.domNode.setAttribute('start', String(startNumber));
                parent.domNode.style.setProperty('--custom-start', startNumber - 1);
                 parent.domNode.style.fontSize = currentFormats['size']; // <-- Try thi
              }
            }, 0);
          }
        }  else if (/^[a-zA-Z]\.$/.test(cleanedText)) {
          console.log("yes this calllllllllllllllllllllllllllllllllllllll")
          const match = cleanedText.match(/^([a-zA-Z])\.$/);
          if (match) {
            Quill.register(CustomAlphaList, true);
            const letter = match[1];
            const isUpper = letter === letter.toUpperCase();
            const startNumber = letter.toLowerCase().charCodeAt(0) - 96; // 'a' = 1
            const listStyle = isUpper ? 'upper-alpha' : 'lower-alpha';

            console.log(`Alphabet list: ${letter}, start=${startNumber}, style=${listStyle}`);

            e.preventDefault();

            // Remove the typed "a." or "A."
            editor.deleteText(range.index - text.length, text.length);
            console.log("startnumber: ", startNumber, "  liststyletype: ", listStyle);
            // Format the line as ordered list
            editor.formatLine(range.index - text.length, 1, 'list', 'ordered');


            // Insert a space after formatting
            editor.insertText(range.index - text.length, ' ');
            editor.setSelection(range.index - text.length + 1, 0);

            // Delay DOM patching to next tick
              setTimeout(() => {
                const [leaf] = editor.getLeaf(range.index - text.length);
                if (!leaf) return;

                let parent = leaf.parent;
                while (parent && parent.domNode?.tagName !== 'OL') {
                  parent = parent.parent;
                }
                if (parent && parent.domNode?.tagName === 'OL') {
                  parent.domNode.setAttribute('start', String(startNumber));
                  parent.domNode.setAttribute('data-alpha', isUpper ? 'upper' : 'lower');
                  parent.domNode.setAttribute('data-alpha', isUpper ? 'upper' : 'lower');
                  console.log('data-alpha set:', parent.domNode.getAttribute('data-alpha'));

                  // parent.domNode.setAttribute('start', String(startNumber));
                  // parent.domNode.style.listStyleType = listStyle; // 'upper-alpha' or 'lower-alpha'
                }
              }, 0);

          }
        } else {
          console.log("Not a numbered list item", cleanedText);
        }
      }

    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



useEffect(() => {
  pages.forEach((page, i) => {
    if (page.type === "pageBreak") {
      const editor = editorRefs.current[currentPage]?.getEditor();
      if (!editor) return; // editor not ready

      // Get cursor position
      
      const selection = editor.getSelection(true);
      const insertIndex = selection ? selection.index : editor.getLength();
      console.log("selection: ", selection.index);
      console.log("insertIndex: ", insertIndex);

      // Insert text at cursor position
      const pageBreakText = "\n----- PAGE BREAK -----\n";
      editor.insertText(insertIndex, pageBreakText, { color: 'white' });


      // Set cursor right after the inserted text
      editor.setSelection(insertIndex + pageBreakText.length);

      console.log("Page break inserted at position:", insertIndex);
    }
  });
}, [pages]);




  useEffect(() => {
    // Exit early if editorRefs are not initialized
    if (!editorRefs) return;

    // Reset document state when no ID is present
    if (!id && !newId) {
      setTimeout(() => {
        // Set default page content and styles
        setPages([{ type: "content", content: "" }]);
        setBgColorSvg("#fefefe");
        setPrevBgColor("#fefefe");
        setSelectedFontSize("12px");
        setSelectedFontSizeValue("12px");
        setSelectedFontValue("arial");
        setSelectedFont("arial");
        setPrevFontColor("black");
        setDucomentName("");
        setEditMode(false);

        // Clear undo/redo history for the first page editor only (safe during new doc setup)
        editorRefs?.current?.forEach((ref:any) => {
          const editor = ref?.getEditor?.();
          if (editor) {
            editor.history.stack.redo = [];
            editor.history.stack.undo = [];
          }
        });
      }, 0);
    } else {
      // If editing an existing document, just reset non-destructive fields
      setTimeout(() => {
        setEditMode(false);
        setDucomentName("");
      }, 0);
    }
  }, []);

  const listData = async () => {
    try {
      setIsLoading(true);
      const data = await getcontractById(id);

      console.log(data, "singal data");
      if (data?.pdfData) {
        // const pdfBlob = convertBase64ToBlob(data?.pdfData, "application/pdf");
        setUplodTrackFile(data?.pdfData);
        console.log(data?.pdfData);
        setShowBlock("uploadTrack");
      }
      if (data?.uploadedWordData) {
        setDocumentData(data?.uploadedWordData);
        setShowBlock("uploadTrack");
        setDocumentContent("word");
      }
      if (data?.wordDocumentData) {
        setDocumentData(data?.wordDocumentData);
      }

      if (data?.pages) {
        setPages(() => {
          // Defensive: if data.pages is undefined, fallback to empty array
          let rawPages = data?.pages ?? [];

          // Map pages and add type 'content' (assuming all are content pages)
          let normalizedPages = rawPages.map((page:any) => ({
            type: "content",        // add type here
            content: page.content || ""  // safely fallback to empty string if needed
          }));

          return normalizedPages;
        });
        setCurrentPage(data?.pages.length - 1);
        setOldPages(data?.pages);
      }

      //updateListStylesForAllPages();

      if (data?.pageSize) {
        setDocumentPageSize(() => {
          let pageSize = data?.pageSize;
          return pageSize;
        });
      }

      if (data?.pageMargins) {
        setDocumentPageMargins(() => {
          let pageSize = data?.pageMargins;
          return pageSize;
        });
      }

      const {
        comments,
        newFontSize,
        newFonts,
        newFontStyles
      } = data || {};

      if (comments) setComments(comments);
      if (newFontSize) setContractNewFontSize(newFontSize);
      if (newFonts) setContractNewFont(newFonts);
      if (newFontStyles) setContractNewFontStyles(newFontStyles);
      setFormState(data?.overview);
      setDucomentName(data?.overview?.name);
      setLifecycleData(data?.lifecycle);
      setApprovers(data?.approval), setCollaborater(data?.collaburater);
      setRecipients(data?.signature);
      setList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) listData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const editorContainerRef: any = useRef(null);

const handleSubmit = async () => {
  try {
      if (!editorRefs) return;
  const editorRef = editorRefs.current[0];
  const quillEditor = editorRef.getEditor();
    const quillEditor1 = editorRefs.current[currentPage].getEditor();
  const savedDelta =  quillEditor.getContents();
  console.log("saveddelta", savedDelta);
    if (!documentName) {
      toast.error("Please enter the name of the document");
      return;
    }

    // 1. Get Quill content as Delta
    const quill = editorRefs.current[currentPage].getEditor();
    if (!quill) {
      toast.error("Editor instance not found.");
      return;
    }

    const contentDelta = quill.getContents(); // This includes your custom embeds like tables
    const contentJSON = JSON.stringify(contentDelta);

    // 2. Prepare your payload including the content
    const payload = {
      documentName,
      content: contentJSON,
      auditTrails: [
        ...(auditTrails || []),
        {
          user: user?.firstName,
          date: new Date(),
          message: "has added the new version",
        },
      ],
      // ... any other data you want to send
    };

    // 3. Save it via your API or local storage
          await createPayload();

    // 4. Reset UI states as you are already doing
    setBgColorSvg("#fefefe");
    setPrevBgColor("#fefefe");
    setSelectedFontSize("12px");
    setSelectedFontSizeValue("12px");
    setSelectedFontValue("arial");
    setSelectedFont("arial");
    setPrevFontColor("black");

    toast.success("Document saved successfully!");
  } catch (error: any) {
    console.log(error);
    let errorMessage = "Failed to save document.";
    if (error.response && error.response.data) {
      errorMessage =
        error.response.data.message ||
        error.response.data ||
        "An error occurred";
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage);
  }
};


  const createPayload = async () => {
    try {
      let status = "Draft";

      const hasReqOption = recipients.some(
        (recipient: any) => recipient.ReqOption
      );

      const hasSignature = recipients.some(
        (recipient: any) => recipient.signature
      );

      // Determine which step to highlight
      if (recipients.length > 0) {
        status = "Review";
      }
      if (hasReqOption) {
        status = "Signing";
        // Update status to 'pending' when there's a ReqOption
      }
      if (hasSignature) {
        status = "Signed";
        // Update status to 'completed' when all required signatures are present
      }

      const payload: any = {
        userId: user._id,
        overview: { ...formState, name: documentName },
        lifecycle: lifecycleData,
        collaburater: collaborater,
        approval: approvers,
        signature: recipients,
        status: status,

        createdBy: user.firstName,
        contractType: IsTemplate ? "template" : "",
        wordDocumentData: showBlock == "" ? documentData : null,
        pdfData: uplodTrackFile,
        uploadedWordData: showBlock === "uploadTrack" ? documentData : null,
        pages: pages,
        pageSize: documentPageSize,
        pageMargins: documentPageMargins,
        newFonts: contractNewFont,
        newFontStyles: contractNewFontStyles,
        newFontSize: contractNewFontSize,
      };

      if (comments.length > 0) {
        payload.comments = comments;
      }

      let response;

      if (newId) {
        response = await updateDocument(newId, payload);
      } else if (id) {
        response = await updateDocument(id, payload);
      } else {
        response = await create(payload);
        if (response.contract._id) {
          setNewId(response.contract._id);
        }
      }

      if (response.ok === true) {
        toast.success(response.message);
        setEditMode(false);

        if (response?.contract?.pages) {
          console.log(response.contract.pages);
          setOldPages(response.contract.pages);
        }
        if (showBlock == "uploadTrack") {
          navigate("/dashboard/contract-list");
        }
      } else {
        const errorMessage = response.message || "An error occurred";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);

      let errorMessage = "Failed to create clause.";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data ||
          "An error occurred";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  // useEffect(() => {
  //   if (!documentReady) return;

  //   console.log("I am called")

  //   createPayload();
  // }, [documentReady]);
  // console.log(showBlock), "block show";

  const [openDropdowns, setOpenDropdowns] = useState({
    file: false,
    view: false,
    signature: false,
    export: false,
    attach: false,
    insert: false,
  });

  const [enabelEditing, setEnabelEditing] = useState(true);

  const toggleDropdown = (dropdown: any) => {
    setOpenDropdowns((prevState: any) => ({
      file: false,
      view: false,
      signature: false,
      export: false,
      attach: false,
      insert: false,
      [dropdown]: !prevState[dropdown],
    }));
  };

  const onToolbarClick = (args: any) => {
    console.log("item clicked : ", args);

    const documentEditor = editorContainerRef.current?.documentEditor;
    console.log("args text:", args.item.id);
    // if (!documentEditor) {
    //   console.error("Document Editor is not initialized yet.");
    //   return;
    // }

    switch (args.item.id) {
      case "undo":
        documentEditor.editorHistory.undo();
        break;
      case "redo":
        documentEditor.editorHistory.redo();
        break;
      case "delete":
        documentEditor.editor.delete();
        break;

      case "bold":
        // Toggles the bold of selected content
        documentEditor.editor.toggleBold();
        break;
      case "italic":
        // Toggles the Italic of selected content
        documentEditor.editor.toggleItalic();
        break;
      case "underline":
        // Toggles the underline of selected content
        documentEditor.editor.toggleUnderline("Single"); // Ensure 'Single' is a valid parameter
        break;

      case "highlight":
        if (documentEditor && documentEditor.selection) {
          // Check if the selected text is already highlighted
          const highlightColor: any =
            documentEditor.selection.characterFormat.highlightColor;
          //Sets highlightColor formatting for selected text.
          documentEditor.selection.characterFormat.highlightColor = "Pink";
          documentEditor.focusIn();
        }
        break;

      case "setupHeader":
        setupHeader();
        break;
      case "setupFooter":
        setupFooter();
        break;

      case "findText":
        const searchText = "example"; // Example text to search for
        if (documentEditor) {
          documentEditor.search.findAll(searchText, "None");
        }
        break;

      case "container_toolbar_open":
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".docx,.pdf";
        fileInput.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            if (file.name.endsWith(".docx")) {
              const reader = new FileReader();
              reader.onload = () => {
                documentEditor?.open(reader.result as string, "Docx");
              };
              reader.readAsDataURL(file);
            } else if (file.name.endsWith(".pdf")) {
              // PDF opening not supported in DocumentEditor; use PDF Viewer or convert to DOCX
              alert("Please convert PDF to DOCX format to open");
            }
          }
        };
        fileInput.click();
        break;

      case "container_toolbar_save":
        documentEditor?.save("Document.docx", "Docx");

        break;

      case "strikethrough":
        // Toggles the strikethrough of selected content
        documentEditor.editor.toggleStrikethrough();
        documentReady;
        break;
      case "subscript":
        // Toggles the subscript of selected content
        documentEditor.editor.toggleSubscript();
        break;
      case "superscript":
        // Toggles the superscript of selected content
        documentEditor.editor.toggleSuperscript();
        break;
      case "AlignLeft":
        //Toggle the Left alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Left");
        break;
      case "AlignRight":
        //Toggle the Right alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Right");
        break;
      case "AlignCenter":
        //Toggle the Center alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Center");
        break;
      case "Justify":
        //Toggle the Justify alignment for selected or current paragraph
        documentEditor.editor.toggleTextAlignment("Justify");
        break;
      case "IncreaseIndent":
        //Increase the left indent of selected or current paragraph
        documentEditor.editor.increaseIndent();
        break;
      case "DecreaseIndent":
        //Decrease the left indent of selected or current paragraph
        documentEditor.editor.decreaseIndent();
        break;
      case "ClearFormat":
        documentEditor.editor.clearFormatting();
        break;
      case "ShowParagraphMark":
        //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
        documentEditor.documentEditorSettings.showHiddenMarks =
          !documentEditor.documentEditorSettings.showHiddenMarks;
        break;

      case "Bullets-Dot":
        documentEditor.editor.applyBullet("\uf0b7", "Symbol"); // Standard dot bullet
        break;
      case "Bullets-Circle":
        documentEditor.editor.applyBullet("\uf06f", "Symbol"); // Open circle bullet
        break;
      case "Bullets-Square":
        documentEditor.editor.applyBullet("\uf0a7", "Wingdings"); // Square bullet
        break;
      // upper lower case
      case "uppercase":
        // Changes the selected text to uppercase
        if (documentEditor.selection && documentEditor.selection.text) {
          const uppercaseText = documentEditor.selection.text.toUpperCase();
          documentEditor.editor.insertText(uppercaseText);
        }
        break;

      case "lowercase":
        // Changes the selected text to lowercase
        if (documentEditor.selection && documentEditor.selection.text) {
          const lowercaseText = documentEditor.selection.text.toLowerCase();
          documentEditor.editor.insertText(lowercaseText);
        }
        break;

      case "lineHeight1":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 1 });
        break;
      case "lineHeight1_5":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 1.5 });
        break;
      case "lineHeight2":
        documentEditor.editor.applyParagraphFormat({ lineSpacing: 2 });
        break;

      // Removed the duplicated 'Custom' case as it seems unnecessary
      default:
        console.warn("Unhandled toolbar item:", args.item.id);
      // Implement any default action or log an unhandled case
    }
  };

  const setupHeader = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Move to the header region
      documentEditor.selection.goToHeader();
      // Insert text or other content into the header
      documentEditor.editor.insertText("Your header content here");

      // Move out of the header/footer editing mode
      documentEditor.editor.toggleHeaderFooter();
    }
  };

  const setupFooter = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentEditor.selection) {
      // Move to the footer region
      documentEditor.selection.goToFooter();
      // Insert text or other content into the footer
      documentEditor.editor.insertText("Your footer content here");

      // Move out of the header/footer editing mode
      documentEditor.editor.toggleHeaderFooter();
    }
  };

  const itemsss: ItemModel[] = [
    {
      text: "Single",
    },
    {
      text: "1.15",
    },
    {
      text: "1.5",
    },
    {
      text: "Double",
    },
  ];

  // Function to update the table tool visibility based on the editor's selection
  const updateTableToolsVisibility = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    setShowTableTools(isTableSelected);
  };

  // Set up an interval to periodically check for table selection
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTableToolsVisibility();
    }, 500); // Check every 500 milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const applyCellFillColor = () => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    documentEditor.selection.cellFormat.background = cellFillColor;
  };

  const items: any = [
    // customItem,
    // "New",

    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "InsertEndnote",
    "InsertFootnote",
    "Separator",
    "Find",
    "Separator",
    "TrackChanges",
    "Comments",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields",
    "Open",
  ];

  const triggerClick = (id: any) => {
    console.log(id, "id");

    const element = document.getElementById(id);
    if (element) {
      element.click();
      // Optionally modify the parent element's style if needed:
      // element.parentNode.style.display = "block";
    } else {
      console.error("Element not found:", id);
    }
  };

  /**
   * Triggers a save prompt and exports the current document content as a .docx file.
   * Uses Syncfusion DocumentEditor instance from a ref.
   */
  const save = () => {
    // Access the DocumentEditor instance safely
    const documentEditor = editorContainerRef.current?.documentEditor;

    // Check if the editor is available before proceeding
    if (!documentEditor) {
      console.error("DocumentEditor is not available.");
      alert("Document editor not initialized.");
      return;
    }

    // Prompt user for a file name
    const userFileName = prompt("Enter a file name for your document:", "My File");

    // If user provides a name, proceed to save
    if (userFileName && userFileName.trim() !== "") {
      documentEditor.save(userFileName.trim(), "Docx");
    } else {
      alert("File name is required to save the document.");
    }
  };


  const onClick = () => {
    const container = editorContainerRef.current;
    if (container) {
      const pdfdocument: PdfDocument = new PdfDocument();
      const count: any = container?.documentEditor?.pageCount;
      container.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
      let loadedPage = 0;

      for (let i = 1; i <= count; i++) {
        setTimeout(() => {
          const format: any = "image/jpeg";
          // Getting pages as image
          const image = container?.documentEditor?.exportAsImage(i, format);
          image.onload = function () {
            const imageHeight = parseInt(image.style.height.replace("px", ""));
            const imageWidth = parseInt(image.style.width.replace("px", ""));
            const section: any = pdfdocument.sections.add();
            const settings: PdfPageSettings = new PdfPageSettings(0);
            if (imageWidth > imageHeight) {
              settings.orientation = PdfPageOrientation.Landscape;
            }
            settings.size = new SizeF(imageWidth, imageHeight);
            section.setPageSettings(settings);
            const page = section.pages.add();
            const graphics = page.graphics;
            const imageStr = image.src.replace("data:image/jpeg;base64,", "");
            const pdfImage = new PdfBitmap(imageStr);
            graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
            loadedPage++;
            if (loadedPage === count) {
              const userFileName = prompt(
                "Enter a file name for your PDF",
                "My pdf"
              );
              if (userFileName) {
                pdfdocument.save(
                  (container?.documentEditor?.documentName === ""
                    ? userFileName
                    : container?.documentEditor?.documentName) + ".pdf"
                );
                pdfdocument.destroy();
              }
            }
          };
          if (image.complete) {
            image.onload(null as any); // Trigger onload immediately if image is cached
          }
        }, 500 * i);
      }
    }
  };

  // Effect to load document data into the editor
  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor && documentData) {
      console.log(documentData, "documentData");
      documentEditor.open(documentData, "Sfdt");
    }
  }, [documentData]);

  useEffect(() => {
    const initializeEditor = () => {
      const editorInstance = editorContainerRef.current?.documentEditor;
      if (editorInstance && !editorInstance.isDocumentLoaded) {
        editorInstance.documentLoaded = () => {
          console.log(
            "Document is now loaded, ready to open default document."
          );
          loadDefaultDocument(editorInstance);
        };
      } else if (editorInstance) {
        loadDefaultDocument(editorInstance);
      } else {
        console.log("Editor instance is not available.");
      }
    };

    const loadDefaultDocument = (editorInstance: any) => {
      const defaultDocument = `{"sections":[{"blocks":[{"paragraphFormat":{},"characterFormat":{},"inlines":[{"text":""}]}]}]}`;
      try {
        editorInstance.open(defaultDocument, "Sfdt");
      } catch (error) {
        console.error("Failed to load default document:", error);
      }
    };

    initializeEditor();
  }, []);

  useEffect(() => {
    const editorContainer = document.getElementById("container");
    if (!editorContainer) return; // Exit if the element is not found

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const fieldPlaceholder = e.dataTransfer?.getData("text/plain");

      // Assuming documentEditor is correctly initialized elsewhere
      // and you're sure about its non-nullness
      const documentEditor = editorContainerRef.current?.documentEditor;
      if (documentEditor && fieldPlaceholder) {
        documentEditor.editor.insertText(fieldPlaceholder);
      }
    };
    if (editorContainer) {
      editorContainer.addEventListener("dragover", handleDragOver);
      editorContainer.addEventListener("drop", handleDrop);
    }

    // Cleanup function to remove the event listeners
    return () => {
      if (editorContainer) {
        editorContainer.removeEventListener("dragover", handleDragOver);
        editorContainer.removeEventListener("drop", handleDrop);
      }
    };
  }, []); // Assuming no dependencies, adjust if necessary

  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    const formFieldsNames: string[] = documentEditor?.exportFormData();
    console.log("formFieldsNames : ", formFieldsNames);
  }, [dragFields]);

  const cancelAllSignatures = () => {
    setRecipients((prev: any) => {
      const updated = prev.map((user: any) => {
        // Check if the user has a non-empty signature
        if (user.signature) {
          return { ...user, signature: "", date: "" }; // Set signature to empty
        }
        return user;
      });
      console.log("Updated recipients after cancelling signatures:", updated); // Log the updated array
      return updated;
    });
  };

  const [readyForUserTrigger, setReadyForUserTrigger] = useState(false);

  useEffect(() => {
    if (location.state?.openFileChooser) {
      setReadyForUserTrigger(true);
    }
  }, [location.state]);

  if (readyForUserTrigger) {
    triggerClick("container_toolbar_open"); // Your existing function to open the file chooser
    setReadyForUserTrigger(false); // Reset the state
  }

  const reverToReview = () => {
    setRecipients((prev: any) => {
      const updated = prev.map((user: any) => {
        // Check if the user has a non-empty signature
        if (user.ReqOption) {
          return { ...user, ReqOption: "" }; // Set signature to empty
        }
        return user;
      });
      console.log("Updated recipients after cancelling signatures:", updated); // Log the updated array
      return updated;
    });
  };

  const Breadcrumb = ({ recipients }: any) => {
    const hasReqOption = recipients.some(
      (recipient: any) => recipient.ReqOption
    );
    const hasSignature = recipients.some(
      (recipient: any) => recipient.signature
    );

    // Determine which step to highlight
    let highlightStep = "";
    if (recipients.length > 0) {
      highlightStep = "Review";
    }
    if (hasReqOption) {
      highlightStep = "Signing";
    }
    if (hasSignature) {
      highlightStep = "Signed";
    }

    const steps = [
      { label: "Draft", step: "" },
      { label: "Review", step: "Review" },
      { label: "Signing", step: "Signing" },
      { label: "Signed", step: "Signed" },
      { label: "Active", step: "Active" },
    ];

    return (
      <div className="flex mt-1 mx-1">
        {steps
          .filter(
            ({ step }) =>
              step === highlightStep ||
              (highlightStep === "" && step === "Draft")
          )
          .map(({ label, step }) => (
            <li
              key={step}
              className="btn-steps d-flex align-items-center"
              style={{ width: label == "Draft" ? "68px" : "80px" }}
            >
              <div className="color mx-2"></div>
              <div className="text-[14px]">{label}</div>
            </li>
          ))}
      </div>
    );
  };
const container = useRef<DocumentEditorContainerComponent | null>(null);  // Use useRef to store container

  const onCreated = useCallback(() => {
    if (container.current) {
      // Now container is safely accessed because we check if it exists
      container.current.documentEditor?.editor.insertText("Document editor");
      container.current.documentEditor?.selection.moveToPreviousCharacter();
      container.current.documentEditor?.selection.selectCurrentWord();

      const selectedContent: string = container.current.documentEditor?.selection.text;
      console.log(selectedContent);
    }
  }, []);

  const [showPopup, setShowPopup] = useState<any>(false);
  const [documentPath, setDocumentPath] = useState("");

  // const documentEditor = editorContainerRef.current?.documentEditor;

  useEffect(() => {
    const documentEditor = editorContainerRef.current?.documentEditor;
    if (documentEditor) {
      documentEditor.isReadOnly = enabelEditing;
    }

    // documentEditor.focusIn(); // Focusing the editor
    // const buttons = document.querySelectorAll(".e-tbar-btn");
    // const items = document.querySelectorAll(".e-toolbar-item");
    // items.forEach((item) => {
    //   item.classList.add("e-overlay");
    // });

    // buttons.forEach((button) => {
    //   button.setAttribute("aria-disabled", "true");
    // });
  }, [enabelEditing]);

  useEffect(() => {
    if (editMode) {
      handleClick();
    }
  }, [editMode]);

  const handleClick = () => {
    setEditMode(true);
    setEnabelEditing(false);
    if (editorRefs) {
      const editor = editorRefs.current[currentPage].getEditor();
      handleChangeSelection(editor.getSelection(true), "user");
      editor.focus();
    }
    const documentEditor = editorContainerRef.current?.documentEditor;
    // documentEditor.focusIn(); // Focusing the editor
    const buttons = document.querySelectorAll(".e-tbar-btn");
    const items = document.querySelectorAll(".e-toolbar-item");
    items.forEach((item) => {
      item.classList.remove("e-overlay");

      console.log(item, "e-overlay"); // This line is optional, for debugging purposes
    });

    buttons.forEach((button) => {
      button.setAttribute("aria-disabled", "false");

      console.log(button.id, "aria-disabled set to false"); // This line is optional, for debugging purposes
    });
  };
  const handleClickCencel = () => {
    const editor = editorRefs.current[currentPage].getEditor();
    editor.history.stack.undo = [];
    editor.history.stack.redo = [];
    if (!id && newId === "") {
      setPages([{ type: "content", content: "" }]);
    }
    setTimeout(() => {
      setBgColorSvg("#fefefe");
      setPrevBgColor("#fefefe");
      setSelectedFontSize("12px");
      setSelectedFontSizeValue("12px");
      setSelectedFontValue("arial");
      setSelectedFont("arial");
      setPrevFontColor("black");
      setFontColorSvg("black")
      editor.format("size","12px")
      editor.format("font","arial")
      editor.format("color","black")
      editor.format("background","#fefefe")
      editor.format("customHeading","paragraph")
    }, 0);

    if (id || newId) {
      setPages(oldPages);
      //updateListStylesForAllPages();
    }
    setEditMode(false);
    setEnabelEditing(true);
  };

  useEffect(() => {
    const calculateWidth = () => {
      const context = document.createElement("canvas").getContext("2d");
      if (context && inputRef.current) {
        inputRef.current.focus();
        context.font = getComputedStyle(inputRef.current).font; // Get the font style from the input
        let totalWidth = 0;
        for (const char of documentName) {
          totalWidth += context.measureText(char).width; // Calculate total width of all characters
        }          
        inputRef.current.style.width = `${Math.max(170, totalWidth)}px`; // Set input width
      }
    };

    calculateWidth(); // Call on mount and documentName change
  }, [documentName]);

  const stripHtml = (html: any) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  // const getTextPositions = (text: any) => {
  //   // Function to get the positions of each line or text block
  //   const lines: any = text.split('\n');
  //   return lines.map((line: any, index: number) => ({
  //     line,
  //     position: index
  //   }));
  // };

  // const dmp = new DiffMatchPatch();

  // const handleChange = (html: string, range: any) => {
  //   // const newText = html;
  //   // const oldText = editorHtml;

  //   // // Compute differences between old and new text
  //   // const diffs = dmp.diff_main(oldText, newText);
  //   // dmp.diff_cleanupSemantic(diffs);

  //   // let addedContent = "";
  //   // let deletedContent = "";
  //   // let position = 0; // Track position in the text

  //   // // Process differences
  //   // diffs.forEach((diff: any) => {
  //   //   if (diff[0] === 1) {
  //   //     // DIFF_INSERT
  //   //     addedContent += diff[1];
  //   //     position += diff[1].length; // Update position
  //   //   } else if (diff[0] === -1) {
  //   //     // DIFF_DELETE
  //   //     deletedContent += diff[1];
  //   //   }
  //   // });

  //   // // Handle added content
  //   // if (addedContent) {
  //   //   setAddedString((prev) => {
  //   //     const updatedAddedString = prev + addedContent;

  //   //     // Update track changes for insertion with position
  //   //     setTrackChanges((prevTrackChanges: any) => [
  //   //       ...prevTrackChanges.filter(
  //   //         (change: any) => change.action !== "INSERTED"
  //   //       ),
  //   //       {
  //   //         user: user?.firstName,
  //   //         changes: updatedAddedString,
  //   //         action: "INSERTED",
  //   //         date: new Date(),
  //   //         position: position, // Track position
  //   //       },
  //   //     ]);

  //   //     return updatedAddedString;
  //   //   });
  //   // }

  //   // // Handle deleted content
  //   // if (deletedContent) {
  //   //   setAddedString((prevAdded) => {
  //   //     const updatedAddedString = prevAdded.replace(deletedContent, "");
  //   //     setTrackChanges((prevTrackChanges: any) => [
  //   //       ...prevTrackChanges.filter(
  //   //         (change: any) => change.action !== "INSERTED"
  //   //       ),
  //   //       {
  //   //         user: user?.firstName,
  //   //         changes: updatedAddedString,
  //   //         action: "INSERTED",
  //   //         date: new Date(),
  //   //         position: position, // Track position
  //   //       },
  //   //     ]);
  //   //     return updatedAddedString;
  //   //   });

  //   //   setDeletedString((prev) => {
  //   //     const updatedDeletedString = prev + deletedContent;

  //   //     // Update track changes for deletion with position
  //   //     setTrackChanges((prevTrackChanges: any) => [
  //   //       ...prevTrackChanges.filter(
  //   //         (change: any) => change.action !== "DELETED"
  //   //       ),
  //   //       {
  //   //         user: user?.firstName,
  //   //         changes: updatedDeletedString,
  //   //         action: "DELETED",
  //   //         date: new Date(),
  //   //         position: position, // Track position
  //   //       },
  //   //     ]);

  //   //     return updatedDeletedString;
  //   //   });
  //   // }

  //   // // Clean up track changes
  //   // if (
  //   //   !addedString ||
  //   //   addedString.trim().replace(/<\/?p>/g, "").length === 0
  //   // ) {
  //   //   setTrackChanges((prev: any) =>
  //   //     prev.filter((a: any) => a.action !== "INSERTED")
  //   //   );
  //   // }
  //   // if (!deletedContent) {
  //   //   setTrackChanges((prev: any) =>
  //   //     prev.filter((a: any) => a.action !== "DELETED")
  //   //   );
  //   // }
  //   // Update editorHtml state
  //   setEditorHtml(html);
  // };

  const cmToPx = (cm: any) => {
    const numericValue = parseFloat(cm.replace(/[^0-9.]/g, ""));
    return numericValue * 37.8;
  };

  // cmToPx(documentPageSize.height)

  const isContentEmpty = (htmlContent: string): boolean => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Check if there is any non-whitespace text content
    return !tempDiv.textContent || !tempDiv.textContent.trim();
  };

  function findDeltaIndexAtCharIndex(delta:any, charIndex:any) {
  let deltaIndex = 0;
  let runningCharCount = 0;

  for (const op of delta.ops) {
    const insert = op.insert;
    const len = typeof insert === 'string' ? insert.length : 1;

    if (runningCharCount + len > charIndex) {
      deltaIndex += charIndex - runningCharCount;
      break;
    } else {
      runningCharCount += len;
      deltaIndex += len;
    }
  }

  return deltaIndex;
}

const PAGE_BREAK_STRING = "----- PAGE BREAK -----";

const handleOverflow = debounce((index, editor, updatedPages) => {
  const currentContent = editor.getContents();
  const plainText = editor.getText();
  const editorHeight = editor.root.scrollHeight;

  // Get current cursor position before any changes
  const selection = editor.getSelection();
  const previousCursorPosition = selection ? selection.index : null;
  console.log("Previous cursor position:", previousCursorPosition);

  // 1. Exit if empty
  if (plainText.trim().length === 0) return;

  // 2. Check for manual page break position
  const breakPosition = plainText.indexOf(PAGE_BREAK_STRING);

  // 3. If manual page break found, split at that position
  if (breakPosition !== -1) {
    // Avoid re-handling same break — check if next page already has content
    if (updatedPages[index + 1]?.content?.ops?.length > 0) return;

    const breakLength = PAGE_BREAK_STRING.length; // include newlines
    const before = currentContent.slice(0, breakPosition);
    const after = currentContent.slice(breakPosition + breakLength);

    editor.setContents(before, "silent");

    moveToNextPage(after, index + 1, updatedPages, setPages, editorRefs);

    return;
  }

  const documentHeight = cmToPx(documentPageSize.height);

  // 4. If no manual break, check for overflow by height
  if (editorHeight <= documentHeight) {
    // Content fits, no need to split
    return;
  }

  // 5. Automatic overflow split:
  // Find largest content slice that fits in the page height
  let fitIndex = currentContent.length(); // start from full length
  let contentToFit = currentContent.slice(0, fitIndex);

  while (fitIndex > 0) {
    editor.setContents(contentToFit, "silent");
    const testHeight = editor.root.scrollHeight;

    if (testHeight <= documentHeight) break;

    // Reduce content size by trimming last operation or characters
    const ops = contentToFit.ops;
    if (ops.length > 0) {
      const lastOp = ops[ops.length - 1];
      if (lastOp.insert && typeof lastOp.insert === "string") {
        const lastSpaceIndex = lastOp.insert.lastIndexOf(" ");
        if (lastSpaceIndex !== -1) {
          lastOp.insert = lastOp.insert.slice(0, lastSpaceIndex);
        } else {
          ops.pop();
        }
      } else {
        ops.pop();
      }
    }

    // Recalculate fitIndex
    fitIndex = contentToFit.ops.reduce((acc:any, op:any) => {
      return acc + (typeof op.insert === "string" ? op.insert.length : 1);
    }, 0);
  }
  console.log("")

  // 6. After fitting content found, split content
  const overflowContent = currentContent.slice(fitIndex);

  // Get current cursor position before any changes
  console.log("new cursor position:", fitIndex);
  
  editor.setContents(contentToFit, "silent");
  editor.setSelection(previousCursorPosition, 0, 'silent');


  moveToNextPage(overflowContent, index + 1, updatedPages, setPages, editorRefs);

}, 100);



function mergeContent(existingContent:any, overflowContent:any) {
  if (!existingContent || !existingContent.ops) {
    return overflowContent;
  }
  if (!overflowContent || !overflowContent.ops) {
    return existingContent;
  }
  // Prepend overflowContent to existingContent for correct order
  return {
    ops: [...overflowContent.ops, ...existingContent.ops],
  };
}


function moveToNextPage(overflowContent:any, nextPageIndex:any, pages:any, setPages:any, editorRefs:any) {
  console.log('mergeContent called');
  const existingNextContent = pages[nextPageIndex]?.content;

  console.log('Existing content ops:', existingNextContent?.ops);
  console.log('Overflow content ops:', overflowContent.ops);

  // Merge overflowContent with existing next page content
  const mergedContent = mergeContent(existingNextContent, overflowContent);

  // Create new pages array with merged content on next page
  const newPages = pages.map((page:any, idx:any) =>
    idx === nextPageIndex
      ? { ...page, content: mergedContent }
      : page
  );

  // If nextPageIndex is beyond current pages length, add new page
  if (nextPageIndex >= pages.length) {
    newPages.push({ content: overflowContent });
  }

  console.log('Updated next page content after merge:', mergedContent);
  setPages(newPages);
  //updateListStylesForAllPages();

  // Optionally, update editor content for next page here too,
  // after state update
  const nextEditorRef = editorRefs.current[nextPageIndex];
  if (nextEditorRef) {
    const quill = nextEditorRef.getEditor();
    quill.setContents(mergedContent);
  }
}


const handleChange = (value: any, delta: any, source: string, editor: any, index: number) => {
  const updatedPages = [...pages];

  // 🛡️ Safely get editor
  const editorRef = editorRefs.current[index];
  if (!editorRef) {
    console.warn(`Editor ref not found at index ${index}`);
    return;
  }

  const quillEditor = editorRef.getEditor();
  if (index >= updatedPages.length) return;

  // Update content only if it changed
  if (updatedPages[index].content !== value) {
    updatedPages[index].content = value;
  }

  //updateListStylesForAllPages();

  handleOverflow(index, quillEditor, updatedPages);
};



  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const currentEditor = editorRefs?.current[index]?.getEditor();

    const range = currentEditor.getSelection(true);
    if (!range) return;

    const format = currentEditor.getFormat(range.index);

    const backspaceFormatting = currentEditor.getFormat(range.index - 1);
    if (event.key === "Backspace") {
      const cursorPosition = currentEditor.getBounds(range.index);
      const container = scrollPageRef.current;
      const containerTop = container.scrollTop;

      if (cursorPosition.top < containerTop) {
        container.scrollTop = cursorPosition.top - container.offsetTop;
      }

      const [line] = currentEditor.getLine(range.index);
      const [lineBefore] = currentEditor.getLine(range.index - 1);
      const charAtCursor = currentEditor.getText(range.index);
      const charBeforeCursor = currentEditor.getText(range.index - 1);

      const lineText = line ? line?.domNode?.innerText : "";
      const lineBeforeText = lineBefore ? lineBefore?.domNode?.innerText : "";

      if (charBeforeCursor == "\n\n" && format.list) {
        currentEditor.format("list", false, "user");
        currentEditor.insertText(range.index, "\u200B", {
          font: selectedFontValue,
          size: selectedFontSizeValue,
          customHeading: "paragraph",
          color: fontColorSvg,
          background: bgColorSvg
        })
      }
      if (
        (charAtCursor == "\n" || charAtCursor.includes("\n")) &&
        range.index !== 0 &&
        lineText.trim().length <= 0 && !format.list
      ) {
        currentEditor.deleteText(range.index - 1, 1, "user");
      }

      if (!format.color) {
        if (backspaceFormatting.color) {
          setTimeout(() => {
            setFontColorSvg(backspaceFormatting.color);
            currentEditor.format("color", backspaceFormatting.color);
          }, 0);
        }
      }


      if (!format.size) {
        if (backspaceFormatting.size) {
          setTimeout(() => {
            currentEditor.format("size", backspaceFormatting.size);
            setSelectedFontSizeValue(backspaceFormatting.size);
          }, 0);
        }
      }

      if (!format.font) {
        if (backspaceFormatting.font) {
          setTimeout(() => {
            currentEditor.format("font", backspaceFormatting.font);
            setSelectedFontValue(backspaceFormatting.font);
          }, 0);
        }
      }

      if (!format.background) {
        if (backspaceFormatting.background) {
          setTimeout(() => {
            currentEditor.format("background", backspaceFormatting.background);
            setBgColorSvg(backspaceFormatting.background);
          }, 0);
        }
      }

      console.log(JSON.stringify(lineBeforeText.trim()))
      if (!format.list && lineBeforeText.trim().length > 1) {
        if (backspaceFormatting.list) {
          setTimeout(() => {
            currentEditor.format("list", backspaceFormatting.list);
            setIsListActive(backspaceFormatting.list)
          }, 0);
        }
      }

      const content = currentEditor.root.innerHTML;
      if (isContentEmpty(content) && index > 0) {
        event.preventDefault();

        setPages((prevPages: any) => {
          const updatedPages = [...prevPages];
          updatedPages.splice(index, 1);
          setCurrentPage(Math.max(0, index - 1));

          setTimeout(() => {
            const editor =
              editorRefs.current[Math.max(0, index - 1)]?.getEditor();
            editor.setSelection(editor.getLength() - 1);
            editor.focus();
            containerRefs.current[Math.max(0, index - 1)]?.scrollIntoView({
              behavior: "smooth",
            });
          }, 100);

          return updatedPages;
        });

        //updateListStylesForAllPages();
      }
    }

    if (event.key === "Enter") {
      const cursorPosition = currentEditor.getBounds(range.index);
      const container = scrollPageRef.current;
      const containerTop = scrollPageRef.current.scrollTop;
      const containerBottom = containerTop + scrollPageRef.current.clientHeight;

      if (cursorPosition.top < containerTop || cursorPosition.bottom > containerBottom - 34 ) {
        container.scrollTop += 20;
      }

      const [line] = currentEditor.getLine(range.index - 1);
      const lineText = line ? line.domNode.innerText : "";
      const [currentLine] = currentEditor.getLine(range.index);
      const currentLineText = currentLine ? currentLine.domNode.innerText : "";
      var customHeading = format?.customHeading;
      var size = format?.size;
      const isEmptyLine = currentLineText.trim().length === 0;
      const isNotParagraph = format.customHeading !== "paragraph";

      if (isEmptyLine && isNotParagraph) {
        customHeading = "paragraph";
        size = selectedFontSize;
        setSelectedHeadersValue(0);
      }

      if (format.color) {
        setFontColorSvg(format.color);
      }
      const htmlSpan = line?.domNode?.innerHTML;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlSpan;
      const lastSpan = tempDiv?.querySelectorAll("span:last-of-type");
      if (lastSpan.length > 0 && lastSpan[0]) {
        var fontClass = Array?.from(lastSpan[0].classList)?.find((cls) =>
          cls.startsWith("ql-font")
        );
      }

      if (fontClass) {
        setTimeout(() => {
          currentEditor.format("font", fontClass?.replace("ql-font-", ""));
          setSelectedFontValue(fontClass?.replace("ql-font-", ""));
        }, 0);
      }
      if (format.size) {
        setSelectedFontSizeValue(format.size);
      }
      if (format.background) {
        setBgColorSvg(format.background);
      }
      if (format.header) {
        currentEditor.format("header", format.header);
      }

      let font = "";
      if (fontClass) {
        font = fontClass.replace("ql-font-", "");
      } else {
        font = format?.font;
      }

      if (lineText.trim() === "") {
        currentEditor.insertText(range.index - 1, "\u200B", format);
      }
      currentEditor.insertText(range.index, "\u200B", {
        size: size,
        font: font,
        color: format.color,
        background: format.background,
        customHeading: customHeading,
      });

      if (lineText.trim().length <= 1 && currentLineText.trim().length <= 0) {
        if (format.list) {
          currentEditor.formatText(range.index - 1, 1, { list: null }, "user");
          currentEditor.format("list", false)
        }
      }
        setTimeout(() => {
        const editor = editorRefs.current[currentPage].getEditor();
        const range = editor.getSelection(true);
        if (!range) return;

          // example after adding or updating new page content
          const newEditor = editorRefs.current[currentPage].getEditor();
          //patchListStartOnEditor(newEditor);
        }, 0); // Delay to let Quill insert the new line first

    }
  };

  useEffect(() => {
    setEditorRefContext(editorRefs.current[currentPage]);
    const editor = editorRefs?.current[currentPage]?.getEditor();
    if (editor) {
      editor.setSelection(editor.getLength() - 1, 0);
      editor.focus();
    }
  }, [currentPage]);

  useEffect(() => {
    if (documentPageSize.title === "JIS B6") {
      setCommentLeftButton("96.5%");
    }

    if (documentPageSize.title === "A6") {
      setCommentLeftButton("95.5%");
    }
    if (documentPageSize.title === "A5") {
      setCommentLeftButton("96.8%");
    }
    if (documentPageSize.title === "A4") {
      setCommentLeftButton("97.8%");
    }
    if (documentPageSize.title === "A3") {
      setCommentLeftButton("98.4%");
    }
    if (documentPageSize.title === "JIS B5") {
      setCommentLeftButton("97.6%");
    }

    if (documentPageSize.title === "Indian Legal") {
      setCommentLeftButton("97.6%");
    }
    if (documentPageSize.title === "US Legal") {
      setCommentLeftButton("97.6%");
    }

    if (documentPageSize.title === "US Letter") {
      setCommentLeftButton("97.6%");
    }
    const editor = editorRefs.current[currentPage]?.getEditor();
    if (editor) {
      const editorHeight = editor.root.scrollHeight;
      const documentHeightPx = cmToPx(documentPageSize.height);
      setToMinus(documentHeightPx - editorHeight);
    }
  }, [editorRefs, currentPage, documentPageSize]);

  // useEffect(() => {
  //   const editor = editorRefs.current[currentPage]?.getEditor();
  //   if (editor) {
  //     const documentHeightPx = cmToPx(documentPageSize.height);

  //     const adjustPagesForNewSize = () => {
  //       setPages((prevPages: any) => {
  //         let updatedPages = [];
  //         let remainingContent = "";
  //         let totalContent = "";

  //         // Aggregate all content to process in one go
  //         prevPages.forEach((page: any) => (totalContent += page.content));

  //         // Create a temporary editor for height measurement
  //         const createTemporaryEditor = () => {
  //           const tempEditor = document.createElement("div");
  //           tempEditor.style.position = "absolute";
  //           tempEditor.style.visibility = "hidden";
  //           tempEditor.style.width = editor.root.offsetWidth + "px"; // Match editor's width
  //           document.body.appendChild(tempEditor);
  //           return tempEditor;
  //         };

  //         // Function to measure the height of content
  //         const measureContentHeight = (content: any, tempEditor: any) => {
  //           tempEditor.innerHTML = content;
  //           return tempEditor.scrollHeight;
  //         };

  //         const tempEditor = createTemporaryEditor();
  //         const editorWidth = editor.root.offsetWidth; // Use the editor's width
  //         const editorHeight = editor.root.scrollHeight;

  //         let start = 0;

  //         while (start < totalContent.length) {
  //           let end = start + 1;
  //           while (end <= totalContent.length) {
  //             const partialContent = totalContent.slice(start, end);
  //             const height = measureContentHeight(partialContent, tempEditor);

  //             if (height > cmToPx(documentPageSize.height) + "400" + "px") {
  //               break;
  //             }
  //             end++;
  //           }

  //           // Update pages
  //           const pageContent = totalContent.slice(start, end - 1);
  //           updatedPages.push({ content: pageContent });

  //           start = end - 1; // Move to the next chunk
  //         }

  //         // Append any remaining content as the last page
  //         if (start < totalContent.length) {
  //           updatedPages.push({ content: totalContent.slice(start) });
  //         }

  //         // Ensure the first page has content if necessary
  //         if (updatedPages.length === 0 || !updatedPages[0].content) {
  //           updatedPages.unshift({ content: "<p><br></p>" });
  //         }

  //         document.body.removeChild(tempEditor);
  //         return updatedPages;
  //       });
  //     };

  //     adjustPagesForNewSize();
  //   }
  // }, [documentPageSize]);

  const rejectChange = (changeToReject: any) => {
    const { action, changes } = changeToReject;

    if (action === "INSERTED") {
      // Remove inserted content from the editor
      let updatedHtml = editorHtml;

      // Use a regex to remove all occurrences of the changes text
      updatedHtml = updatedHtml.replace(new RegExp(changes, "g"), "");

      // Update state
      setEditorHtml(updatedHtml);

      // Update track changes
      setTrackChanges((prev: any) =>
        prev.filter((change: any) => change !== changeToReject)
      );
    } else if (action === "DELETED") {
      // Add deleted content back to the editor
      const updatedHtml = editorHtml + changes;

      // Update state
      setEditorHtml(updatedHtml);

      // Update track changes
      setTrackChanges((prev: any) =>
        prev.filter((change: any) => change !== changeToReject)
      );
    }
  };

  useEffect(() => {
    if (!editorRefs.current[currentPage]) return;
    const editor = editorRefs.current[currentPage].getEditor();
    if (editor && selection) {
      const bounds = editor?.getBounds(selection.index);
      setButtonPosition({ top: bounds.bottom + 20 });
    }
  }, [selection]);

  type range = {
    index: number;
    length: number;
  };

  const handleChangeSelection = (range: range, source: string) => {
    const editor = editorRefs.current[currentPage].getEditor();
    if (range) {
      const [line] = editor.getLine(range.index - 1);
      // console.log(line?.domNode?.innerText == "\u200B");
      const format = editor.getFormat(range.index);
      console.log(format);
      if (format.color) {
        setFontColorSvg(format.color);
      } else {
        if (line?.domNode?.innerText?.length <= 1 && line?.domNode?.innerText != "\u200B") {
          if (range.length === 0) {
            editor.format("color", prevFontColor);
            setFontColorSvg(prevFontColor);
          }
        }
      }
      if (format.background) {
        setBgColorSvg(format.background);
      } else {
        if (line?.domNode?.innerText?.length <= 1 && line?.domNode?.innerText != "\u200B") {
          if (range.length === 0) {
            editor.format("background", prevBgColor);
            setBgColorSvg(prevBgColor);
          }
        }
      }

      setIsListActive(format.list || "");
      setIsScriptActice(format.script || "");
      setIsBoldActive(format.bold || false);
      setIsItalicActive(format.italic || false);
      setIsStrikeActive(format.strike || false);
      setIsUnderlineActive(format.underline || false);

      if (format.lineHeight) {
        setSpacing(format.lineHeight);
      }
      else {
        editor.format("lineHeight", "1.5");
        setSpacing("1.5");
      }

      if (format.font) {
        setSelectedFontValue(format.font);
      } else {
        if (line?.domNode?.innerText?.length <= 1 && line?.domNode?.innerText != "\u200B") {
          if (range.length === 0) {
            editor.format("font", selectedFont);
            setSelectedFontValue(selectedFont);
          }
        }
      }

      if (format.size) {
        setSelectedFontSizeValue(format.size);
      } else {
        if (range.length > 0) {
          const format = editor.getFormat(range.index, range.length);
          if (format.size) {
            setSelectedFontSizeValue(format.size);
            if (typeof format.size === "object") {
              setSelectedFontSizeValue(format.size[0]);
            }
          }
        } else {
          if (!format.header) {
            if (line?.domNode?.innerText?.length <= 1 && line?.domNode?.innerText != "\u200B") {
              editor.format("size", selectedFontSize);
              setSelectedFontSizeValue(selectedFontSize);
            }
          } else {
            editor.format(
              "size",
              format.header == 1
                ? "24px"
                : format.header == 2
                  ? "18px"
                  : format.header == 3
                    ? "14px"
                    : "13px"
            );
          }
        }
      }

      if (format.customHeading) {
        setSelectedHeadersValue(
          format.customHeading == "heading-1"
            ? 1
            : format.customHeading == "heading-2"
              ? 2
              : format.customHeading == "heading-3"
                ? 3
                : format.customHeading == "heading-4"
                  ? 4
                  : format.customHeading == "paragraph"
                    ? 0
                    : 0
        );
      } else {
        editor.format("customHeading", "paragraph");
        setSelectedHeadersValue(0);
      }
    }

    if (range && range.length > 0) {
      const format = editor.getFormat(range);

      if (format.font && Array.isArray(format.font)) {
        setSelectedFontValue("");
      } else {
        const content = editor.getContents(range.index, range.length);
        const extractedFonts: string[] = [];
        content.ops.forEach((op: any) => {
          if (
            op?.attributes?.font &&
            !extractedFonts.includes(op?.attributes?.font)
          ) {
            extractedFonts.push(op.attributes.font);
          }
        });

        if (extractedFonts.length === 1) {
          setSelectedFontValue(extractedFonts[0]);
        } else {
          setSelectedFontValue("");
        }
      }

      if (!format.size || format.size.constructor == Array) {
        setSelectedFontSizeValue("");
      } else {
        setSelectedFontSizeValue(format.size);
      }

      if (!format.customHeading || format.customHeading.constructor == Array) {
        setSelectedHeadersValue("");
      } else {
        setSelectedHeadersValue(
          format.customHeading == "heading-1"
            ? 1
            : format.customHeading == "heading-2"
              ? 2
              : format.customHeading == "heading-3"
                ? 3
                : format.customHeading == "heading-4"
                  ? 4
                  : format.customHeading == "paragraph"
                    ? 0
                    : ""
        );
      }

      setSelection(range);
      // selectionRef.current = range;
      const existingComment = comments?.find(
        (comment: any) =>
          comment.range.index === range.index &&
          comment.range.length === range.length
      );
      if (existingComment) {
        setCurrentComment(existingComment.text);
      } else {
        setCurrentComment("");
      }
    } else {
      if (!openComment) {
        setSelection(null);
      }
    }
  };

  const [buttonPosition, setButtonPosition] = useState<any>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (openComment && inputRef.current) {
      commentInputRef.current.focus();
    }
  }, [openComment]);

  const addComment = () => {
    const checkOverlap = (newComment: any) => {
      const commentHeight = 119;
      const commentWidth = 300;

      return comments.some((comment: any) => {
        const newCommentTop = newComment.style.top;
        const newCommentLeft =
          parseInt(newComment.style.left.replace("rem", "")) * 16; // Convert rem to pixels
        const existingCommentTop = comment.style.top;
        const existingCommentLeft =
          parseInt(comment.style.left.replace("rem", "")) * 16; // Convert rem to pixels

        return (
          Math.abs(newCommentTop - existingCommentTop) < commentHeight &&
          Math.abs(newCommentLeft - existingCommentLeft) < commentWidth
        );
      });
    };

    if (editComment) {
      const updatedComments = comments.map((comment: any, index: any) => {
        if (index === editCommentIndex) {
          return {
            ...comment,
            text: currentComment,
            date: new Date(),
            user: user?.firstName || user?.email,
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setEditComment(false);
      SetOpenComment(false);
      setCurrentComment("");
      setEditCommmentIndex(null);
    } else {
      if (currentComment) {
        let initialTop = buttonPosition.top;

        let newComment = {
          range: selectionRef.current,
          text: currentComment,
          style: {
            top: initialTop,
            left: `52rem`,
          },
          access: isInternal ? "Internal" : "Public",
          date: new Date(),
          user: user?.firstName || user?.email,
        };

        // Adjust position to avoid overlap
        while (checkOverlap(newComment)) {
          initialTop += 60; // Adjust the value based on your requirement
          newComment.style.top = initialTop;
        }

        const newComments = [...comments, newComment];
        setComments(newComments);
        SetOpenComment(false);
        setCurrentComment("");
        setEditComment(false);
      }
    }
    setCommentSelection(null);
    setSelection(null);
    selectionRef.current = null;
  };

  const handleReply = (index: number) => {
    if (reply[index].length > 0) {
      setComments((prevComments: any) => {
        const updatedComments = [...prevComments];
        if (!updatedComments[index].replies) {
          updatedComments[index].replies = [];
        }
        updatedComments[index].replies.push({
          text: reply[indexComment],
          date: new Date(),
          user: user?.firstName || user?.email,
        });

        return updatedComments;
      });
    }
    setReply((prevReplies: any) => ({
      ...prevReplies,
      [index]: ``,
    }));
    setCurrentComment("");
    SetOpenComment(false);
    setEditComment(false);
    setAddReply({ open: false, id: "" });
  };

  const [addReply, setAddReply] = useState<any>({
    open: false,
    id: "",
  });

  const handleReplyChange = (indexComment: number, value: string) => {
    setReply((prevReplies: any) => ({
      ...prevReplies,
      [indexComment]: value,
    }));
  };

  const handleClickSignatures = () => {
    setAddSigns(!addSigns);
    if (addSigns) {
      setAuditTrails([
        ...auditTrails,
        {
          user: user.firstName,
          date: new Date(),
          message: "enabled the pre-set signature block",
        },
      ]);
      if (editorContainerRef && editorContainerRef.current) {
        const quill = editorContainerRef.current.getEditor();
        const length = quill.getLength(); // Get the length of the editor content

        // Clear existing signature content by removing the last signature-blot
        const root = quill.root;
        const existingBlots = root.querySelectorAll(".main-signature");
        existingBlots.forEach((blot: any) => blot.remove());

        // Insert new signature blot
        quill.insertEmbed(length - 1, "signature-blot", { recipients });
      }
    } else {
      if (editorContainerRef && editorContainerRef.current) {
        setAuditTrails([
          ...auditTrails,
          {
            user: user.firstName,
            date: new Date(),
            message: "disabled the pre-set signature block",
          },
        ]);
        const quill = editorContainerRef.current.getEditor();
        const root = quill.root;
        const existingBlots = root.querySelectorAll(".main-signature");
        existingBlots.forEach((blot: any) => blot.remove());
      }
    }
  };

  useEffect(() => {
    if (editorRefs.current[currentPage]) {
      const fontChange = () => {
        if (selectedHeaders === 1) {
          setSelectedFontSizeValue("24px");
        }
        if (selectedHeaders === 2) {
          setSelectedFontSizeValue("18px");
        }
        if (selectedHeaders === 3) {
          setSelectedFontSizeValue("14px");
        }
        if (selectedHeaders === 4) {
          setSelectedFontSizeValue("13px");
        }
        if (selectedHeaders === 0) {
          setSelectedFontSizeValue("12px");
        }
      };

      fontChange();
    }
  }, [selectedHeaders]);

  const handleImageResize = () => {
    const quill = editorRefs.current[currentPage].getEditor();
    const editorElement = quill.root;

    editorElement.addEventListener("mousedown", (event: any) => {
      if (
        event.target.tagName === "IMG" &&
        event.target.classList.contains("resizable")
      ) {
        const img = event.target;
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = img.clientWidth;
        const startHeight = img.clientHeight;

        const onMouseMove = (moveEvent: any) => {
          const width = startWidth + (moveEvent.clientX - startX);
          const height = startHeight + (moveEvent.clientY - startY);
          img.style.width = `${width}px`;
          img.style.height = `${height}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        event.preventDefault(); // Prevent text selection while resizing
      }
    });
  };

  useEffect(() => {
    handleImageResize();
  }, [editorRefs]);

  const CrossImage = () => {
    return (
      <svg
        width="10"
        height="10"
        viewBox="0 0 6 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 0.632473L5.36753 0L3 2.36753L0.632473 0L0 0.632473L2.36753 3L0 5.36753L0.632473 6L3 3.63247L5.36753 6L6 5.36753L3.63247 3L6 0.632473Z"
          fill="black"
        />
      </svg>
    );
  };

  const Internal = () => {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 6.66667H7V7.77778H8V6.66667ZM8 4.44444H7V5.55556H8V4.44444ZM9 8.88889H5V7.77778H6V6.66667H5V5.55556H6V4.44444H5V3.33333H9V8.88889ZM4 2.22222H3V1.11111H4V2.22222ZM4 4.44444H3V3.33333H4V4.44444ZM4 6.66667H3V5.55556H4V6.66667ZM4 8.88889H3V7.77778H4V8.88889ZM2 2.22222H1V1.11111H2V2.22222ZM2 4.44444H1V3.33333H2V4.44444ZM2 6.66667H1V5.55556H2V6.66667ZM2 8.88889H1V7.77778H2V8.88889ZM5 2.22222V0H0V10H10V2.22222H5Z"
          fill="black"
        />
      </svg>
    );
  };

  const Public = () => {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.95 7.695C7.82 7.295 7.445 7 7 7H6.5V5.5C6.5 5.36739 6.44732 5.24021 6.35355 5.14645C6.25979 5.05268 6.13261 5 6 5H3V4H4C4.13261 4 4.25979 3.94732 4.35355 3.85355C4.44732 3.75979 4.5 3.63261 4.5 3.5V2.5H5.5C5.76522 2.5 6.01957 2.39464 6.20711 2.20711C6.39464 2.01957 6.5 1.76522 6.5 1.5V1.295C7.965 1.885 9 3.32 9 5C9 6.04 8.6 6.985 7.95 7.695ZM4.5 8.965C2.525 8.72 1 7.04 1 5C1 4.69 1.04 4.39 1.105 4.105L3.5 6.5V7C3.5 7.26522 3.60536 7.51957 3.79289 7.70711C3.98043 7.89464 4.23478 8 4.5 8V8.965ZM5 0C4.34339 0 3.69321 0.129329 3.08658 0.380602C2.47995 0.631876 1.92876 1.00017 1.46447 1.46447C0.526784 2.40215 0 3.67392 0 5C0 6.32608 0.526784 7.59785 1.46447 8.53553C1.92876 8.99983 2.47995 9.36812 3.08658 9.6194C3.69321 9.87067 4.34339 10 5 10C6.32608 10 7.59785 9.47322 8.53553 8.53553C9.47322 7.59785 10 6.32608 10 5C10 4.34339 9.87067 3.69321 9.6194 3.08658C9.36812 2.47995 8.99983 1.92876 8.53553 1.46447C8.07124 1.00017 7.52005 0.631876 6.91342 0.380602C6.30679 0.129329 5.65661 0 5 0Z"
          fill="black"
        />
      </svg>
    );
  };

  const handleOpenOptionsMenu = (event: any, index: number) => {
    setIndexComment(index);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditComment = (index: number) => {
    setEditComment(true);
    setEditCommmentIndex(indexComment);
    setCurrentComment(comments[indexComment]?.text);
    handleClose();
  };

  useEffect(() => {
    const calculateRemainingVh = debounce(() => {
        const viewportHeight = window.innerHeight;

        const div1Height = div1Ref.current?.offsetHeight || 0;
        const div2Height = div2Ref.current?.offsetHeight || 0;
        const div3Height = div3Ref.current?.offsetHeight || 0;
        const div3Width = div3Ref.current?.offsetWidth || 0;

        setFooterWidth(div3Width);

        const totalHeight = div1Height + div2Height + div3Height + 44;
        const totalHeightInVh = (totalHeight / viewportHeight) * 100;
        const remaining = 100 - totalHeightInVh;

        setRemainingVh((prev) => (remaining > 0 ? remaining : 0) !== prev ? (remaining > 0 ? remaining : 0) : prev);
       setDocumentHeight(cmToPx(documentPageSize.height)) 
    }, 300);

    calculateRemainingVh(); // Initial calculation on load

    window.addEventListener("resize", calculateRemainingVh);

    return () => window.removeEventListener("resize", calculateRemainingVh);
}, []);


  useEffect(() => {
    const updateFooterWidth = () => {
      const div3Width = div3Ref.current?.offsetWidth || 0;
      setFooterWidth(div3Width);
    };

    // Initial call to set the footer width
    updateFooterWidth();

    // Set up the MutationObserver
    const observer = new MutationObserver(updateFooterWidth);

    // Start observing changes in div3Ref
    if (div3Ref.current) {
      observer.observe(div3Ref.current, {
        attributes: true,    // Observe attribute changes
        childList: true,     // Observe direct children changes
        attributeFilter: ["style"],
        subtree: true        // Observe all descendant changes
      });
    }

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  const EditIconSvg = () => {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="edit-icon-btn"
          d="M3.01992 8.8125C3.04336 8.8125 3.0668 8.81016 3.09023 8.80664L5.06133 8.46094C5.08477 8.45625 5.10703 8.4457 5.12344 8.42813L10.091 3.46055C10.1019 3.44971 10.1105 3.43683 10.1164 3.42265C10.1223 3.40847 10.1253 3.39328 10.1253 3.37793C10.1253 3.36258 10.1223 3.34738 10.1164 3.33321C10.1105 3.31903 10.1019 3.30615 10.091 3.29531L8.14336 1.34648C8.12109 1.32422 8.0918 1.3125 8.06016 1.3125C8.02852 1.3125 7.99922 1.32422 7.97695 1.34648L3.00937 6.31406C2.9918 6.33164 2.98125 6.35273 2.97656 6.37617L2.63086 8.34727C2.61946 8.41004 2.62353 8.47466 2.64273 8.53551C2.66192 8.59635 2.69566 8.65161 2.74102 8.69648C2.81836 8.77148 2.91563 8.8125 3.01992 8.8125ZM3.80977 6.76875L8.06016 2.51953L8.91914 3.37852L4.66875 7.62773L3.62695 7.81172L3.80977 6.76875ZM10.3125 9.79688H1.6875C1.48008 9.79688 1.3125 9.96445 1.3125 10.1719V10.5938C1.3125 10.6453 1.35469 10.6875 1.40625 10.6875H10.5938C10.6453 10.6875 10.6875 10.6453 10.6875 10.5938V10.1719C10.6875 9.96445 10.5199 9.79688 10.3125 9.79688Z"
        />
      </svg>
    );
  };

  const [editorZoom,setEditorZoom ] = useState("50%");
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            height: "50vh",
          }}
        >
          {" "}
          {/* <ProgressCircularCustomization /> */}
        </Box>
      )}
      <div
        style={{
          width: "100%",
          // height: "100vh",
          opacity: isLoading ? "0%" : "100%",
        }}
      >
        <div
          ref={div1Ref}
          style={{
            display: "flex",
            background: "white",
            minHeight: "50px",
            height: "50px",
            maxHeight: "50px",
            paddingLeft: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              mr: "1rem",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={documentName}
              onChange={(e) => setDucomentName(e.target.value)}
              placeholder="Untitled Document"
              className="input-placeholder-color color-docs"
              maxLength={50}
              style={{
                fontSize: "18px",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                outline: "none",
                width: 168,
              }}
            />

            <div
              className="border- flex justify-center items-end space-x-1.5 cursor-pointer"
              style={{
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                width: 71,
                height: 35,
                padding: "4px 8px",
              }}
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.125 7.49375H12.7109L9.96172 4.86406C9.92674 4.83132 9.88073 4.81291 9.83281 4.8125H3.875C3.46016 4.8125 3.125 5.14766 3.125 5.5625V19.4375C3.125 19.8523 3.46016 20.1875 3.875 20.1875H21.125C21.5398 20.1875 21.875 19.8523 21.875 19.4375V8.24375C21.875 7.82891 21.5398 7.49375 21.125 7.49375ZM20.1875 18.5H4.8125V6.5H9.23047L12.0336 9.18125H20.1875V18.5Z"
                  fill="#7F7F7F"
                />
              </svg>
            </div>
            {(showBlock === "" || showBlock === "pdf") && (
              <>
                {/* <div className="relative  ">
                  <button
                    className={`text-black text-[14px]   rounded focus:outline-none flex whitespace-nowrap  ${showBlock == "uploadTrack"
                        ? "text-gray-300"
                        : "text-black hover:text-gray-700"
                      }`}
                    disabled={showBlock == "uploadTrack"}
                    onClick={() => toggleDropdown("signature")}
                  // onMouseEnter={() => {
                  //   toggleDropdown("signature");
                  // }}
                  >
                    Manage Document
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        marginTop: ".4rem",
                        color: "#174B8B",
                        fontSize: "16px",
                        transform: !openDropdowns.signature
                          ? "rotate(-90deg)"
                          : "none", // Rotate the chevron when the dropdown is open
                        display: "inline-block", // Ensure the span can be transformed
                        transition: "transform 0.3s ease", // Smooth transition for rotation
                      }}
                    >
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.88 7.41504L8 10.2513L14.12 7.41504L16 8.29248L8 12L0 8.29248L1.88 7.41504ZM1.88 3.70752L8 6.54377L14.12 3.70752L16 4.58496L8 8.29248L0 4.58496L1.88 3.70752ZM1.88 0L8 2.83625L14.12 0L16 0.877446L8 4.58496L0 0.877446L1.88 0Z"
                          fill="#174B8B"
                        />
                      </svg>
                    </span>{" "}
                  </button>
                  {openDropdowns.signature && (
                    <ul
                      className="absolute space-y-0 text-[14px] py-2 left-0 -mt-1 w-60 bg-red shadow-lg rounded z-10"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1.5px dashed #174B8B",
                      }}
                    >
                      <li
                        className="px-2 py-2 pb-2 cursor-pointer flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                        onClick={() => {
                          triggerClick(
                            "container_editor_font_properties_properties"
                          );
                          toggleDropdown("signature");
                        }}
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.65374 13.7143H1.55125V1.52381H6.98061V5.33333H10.8587V7.69524L12.41 6.17143V4.57143L7.75623 0H1.55125C0.698061 0 0 0.685714 0 1.52381V13.7143C0 14.5524 0.698061 15.2381 1.55125 15.2381H4.65374V13.7143ZM12.5651 8.38095C12.6427 8.38095 12.7978 8.45714 12.8753 8.53333L13.8837 9.52381C14.0388 9.67619 14.0388 9.98095 13.8837 10.1333L13.108 10.8952L11.4792 9.29524L12.2548 8.53333C12.3324 8.45714 12.41 8.38095 12.5651 8.38095ZM12.5651 11.3524L7.8338 16H6.20499V14.4L10.9363 9.75238L12.5651 11.3524Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Edit
                      </li>
                      <li
                        onClick={() => {
                          // saveDocumentToState();
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2 cursor-pointer flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.8889 0H1.55556C0.692222 0 0 0.8 0 1.77778V14.2222C0 15.2 0.692222 16 1.55556 16H12.4444C13.3 16 14 15.2 14 14.2222V3.55556L10.8889 0ZM12.4444 14.2222H1.55556V1.77778H10.2433L12.4444 4.29333V14.2222ZM7 8C5.70889 8 4.66667 9.19111 4.66667 10.6667C4.66667 12.1422 5.70889 13.3333 7 13.3333C8.29111 13.3333 9.33333 12.1422 9.33333 10.6667C9.33333 9.19111 8.29111 8 7 8ZM2.33333 2.66667H9.33333V6.22222H2.33333V2.66667Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Save
                      </li>

                      <li
                        onClick={() => {
                          // saveDocumentToState();
                          toggleDropdown("signature");
                        }}
                        className="px-2  py-2 cursor-pointer   flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0363 0.499866L13.5811 4.72096C14.1396 5.39599 14.1396 6.47263 13.5811 7.14766L7 15.0003C5.88286 16.3332 4.0711 16.3332 2.9468 15.0003L0.418926 11.984C-0.139642 11.3089 -0.139642 10.2323 0.418926 9.55728L8.00972 0.499866C8.57545 -0.166622 9.47775 -0.166622 10.0363 0.499866ZM1.42864 10.7706L3.96368 13.7869C4.52225 14.4619 5.42455 14.4619 5.99028 13.7869L8.51816 10.7706L4.9734 6.54099L1.42864 10.7706Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Cancel
                      </li>

                      <li
                        className="px-2 py-2 cursor-pointer border-y border-[#174B8B] flex items-center gap-x-2"
                        onClick={() => {
                          setShowPopup((current: any) => !current);
                          toggleDropdown("signature");
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.33333 8L6.22222 4V7H0V9H6.22222V12L9.33333 8ZM14 14V2C14 0.89 13.3 0 12.4444 0H3.11111C2.69855 0 2.30289 0.210714 2.01117 0.585786C1.71944 0.960859 1.55556 1.46957 1.55556 2V5H3.11111V2H12.4444V14H3.11111V11H1.55556V14C1.55556 14.5304 1.71944 15.0391 2.01117 15.4142C2.30289 15.7893 2.69855 16 3.11111 16H12.4444C12.857 16 13.2527 15.7893 13.5444 15.4142C13.8361 15.0391 14 14.5304 14 14Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Import Document
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2   cursor-pointer  flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5263 14.5455H4.42105V4.36364H12.5263V14.5455ZM12.5263 2.90909H4.42105C4.03021 2.90909 3.65537 3.06234 3.379 3.33512C3.10263 3.6079 2.94737 3.97787 2.94737 4.36364V14.5455C2.94737 14.9312 3.10263 15.3012 3.379 15.574C3.65537 15.8468 4.03021 16 4.42105 16H12.5263C12.9172 16 13.292 15.8468 13.5684 15.574C13.8447 15.3012 14 14.9312 14 14.5455V4.36364C14 3.97787 13.8447 3.6079 13.5684 3.33512C13.292 3.06234 12.9172 2.90909 12.5263 2.90909ZM10.3158 0H1.47368C1.08284 0 0.708001 0.153246 0.431632 0.426027C0.155263 0.698807 0 1.06878 0 1.45455V11.6364H1.47368V1.45455H10.3158V0Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Copy as a Template
                      </li>
                      <li
                        className="px-2 py-2 hover:bg-gray-200 cursor-pointer border-t pt-2 border-b border-[#174B8B]  flex items-center gap-x-2"
                        onClick={() => {
                          triggerClick("container_toolbar_open");
                          toggleDropdown("signature");
                        }}
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.43478 8C2.43478 8.888 1.89304 9.6 1.21739 9.6C0.547826 9.6 0 8.888 0 8C0 7.12 0.547826 6.4 1.21739 6.4C1.89304 6.4 2.43478 7.12 2.43478 8ZM1.82609 0V4.8H0.608696V0H1.82609ZM0.608696 16V11.2H1.82609V16H0.608696ZM14 3.2V12.8C14 13.688 13.4583 14.4 12.7826 14.4H5.47826C4.8087 14.4 4.26087 13.688 4.26087 12.8V9.6L3.04348 8L4.26087 6.4V3.2C4.26087 2.312 4.8087 1.6 5.47826 1.6H12.7826C13.4583 1.6 14 2.312 14 3.2ZM12.7826 3.2H5.47826V7.064L4.76609 8L5.47826 8.936V12.8H12.7826V3.2ZM6.69565 5.6H11.5652V7.2H6.69565V5.6ZM6.69565 8.8H10.3478V10.4H6.69565V8.8Z"
                            fill="#174B8B"
                          />
                        </svg>
                        View Audit Trail
                      </li>
                      <li
                        className="px-2 py-2 hover:bg-gray-200 cursor-pointer  pt-2 border-b border-[#174B8B]  flex items-center gap-x-2"
                        onClick={() => {
                          triggerClick("container_toolbar_open");
                          toggleDropdown("signature");
                        }}
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.2547 1.19687L14.0629 1H14.3474L21.1538 7.98557V8.27758L21.0239 8.14424L14.2547 1.19687ZM12.5385 1V1.89474V8.8421V9.8421H13.5385H20.3077H21.1538V11.7682C20.6813 11.68 20.1934 11.6316 19.6923 11.6316C15.0419 11.6316 11.3077 15.5018 11.3077 20.2105C11.3077 20.7339 11.357 21.2435 11.4468 21.7368H2.46154C1.68109 21.7368 1 21.0817 1 20.2105V2.52632C1 1.65185 1.672 1 2.46154 1H12.5385ZM16.1969 20.1782L17.4376 21.4515L18.1538 22.1866L18.8701 21.4515L22.4994 17.7268L22.6667 17.9355L18.1856 22.5344L16.1365 20.2402L16.1969 20.1782Z"
                            stroke="#174B8B"
                            stroke-width="2"
                          />
                        </svg>
                        Clauses
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2  cursor-pointer   flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.8356 8.72L8.22799 13.28H6.77227V11.44L10.3799 6.88L11.8356 8.72ZM13.9876 8.08C13.9876 8.32 13.7977 8.56 13.6078 8.8L12.0255 10.8L11.4559 10.08L13.1015 8L12.7217 7.52L12.2787 8.08L10.823 6.24L12.2154 4.56C12.342 4.4 12.5952 4.4 12.785 4.56L13.6711 5.68C13.7977 5.84 13.7977 6.16 13.6711 6.4C13.5445 6.56 13.418 6.72 13.418 6.88C13.418 7.04 13.5445 7.2 13.6711 7.36C13.861 7.6 14.0509 7.84 13.9876 8.08ZM1.26584 14.4V1.6H5.6963V5.6H8.86091V6.8L10.1268 5.2V4.8L6.32922 0H1.26584C0.56963 0 0 0.72 0 1.6V14.4C0 15.28 0.56963 16 1.26584 16H8.86091C9.55713 16 10.1268 15.28 10.1268 14.4H1.26584ZM6.32922 12.08C6.20264 12.08 6.07606 12.16 6.01276 12.16L5.6963 10.4H4.74692L3.41778 11.76L3.79753 9.6H2.84815L2.21523 13.6H3.16461L5.00009 11.52L5.37984 13.36H6.01276L6.32922 13.28V12.08Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Request Signature
                      </li>
                      <li
                        onClick={() => {
                          cancelAllSignatures(), toggleDropdown("signature");
                        }}
                        className="px-2 py-2   flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "inherit"
                            : "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                        style={{
                          color: !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "gray"
                            : "inherit", // Light blue if condition is true, else no color
                          borderColor: !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "gray"
                            : "#a1a1a1", // Dark blue if true, else grey
                          cursor: !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "auto"
                            : "pointer",
                        }}
                      >
                        <svg
                          width="14"
                          height="17"
                          viewBox="0 0 14 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.8356 9.66089L8.22799 14.19H6.77227V12.3624L10.3799 7.83336L11.8356 9.66089ZM13.9876 9.02523C13.9876 9.2636 13.7977 9.50197 13.6078 9.74034L12.0255 11.7268L11.4559 11.0117L13.1015 8.94577L12.7217 8.46902L12.2787 9.02523L10.823 7.1977L12.2154 5.52909C12.342 5.37017 12.5952 5.37017 12.785 5.52909L13.6711 6.6415C13.7977 6.80041 13.7977 7.11824 13.6711 7.35661C13.5445 7.51553 13.418 7.67445 13.418 7.83336C13.418 7.99228 13.5445 8.15119 13.6711 8.31011C13.861 8.54848 14.0509 8.78685 13.9876 9.02523ZM1.26584 15.3024V2.58915H5.6963V6.56204H8.86091V7.7539L10.1268 6.16475V5.76746L6.32922 1H1.26584C0.56963 1 0 1.71512 0 2.58915V15.3024C0 16.1764 0.56963 16.8915 1.26584 16.8915H8.86091C9.55713 16.8915 10.1268 16.1764 10.1268 15.3024H1.26584ZM6.32922 12.9981C6.20264 12.9981 6.07606 13.0776 6.01276 13.0776L5.6963 11.3295H4.74692L3.41778 12.6803L3.79753 10.5349H2.84815L2.21523 14.5078H3.16461L5.00009 12.4419L5.37984 14.2694H6.01276L6.32922 14.19V12.9981Z"
                            fill="#174B8B"
                          />
                          <line
                            y1="-0.5"
                            x2="19.6648"
                            y2="-0.5"
                            transform="matrix(0.581374 0.813637 -0.735688 0.677321 0 1)"
                            stroke="#174B8B"
                          />
                        </svg>
                        Cancel All Signatures
                      </li>
                      <li
                        onClick={() => {
                          reverToReview(), toggleDropdown("signature");
                        }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          !recipients.some(
                            (recipient: any) => recipient.signature
                          )
                            ? "inherit"
                            : "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                        className="px-2  py-2 cursor-pointer flex items-center gap-x-2"
                        style={{
                          color: !recipients.some(
                            (recipient: any) => recipient.ReqOption
                          )
                            ? "gray"
                            : "inherit",
                          cursor: !recipients.some(
                            (recipient: any) => recipient.ReqOption
                          )
                            ? "auto"
                            : "pointer",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 0C6.4087 0 4.88258 0.842855 3.75736 2.34315C2.63214 3.84344 2 5.87827 2 8H0L2.59333 11.4578L2.64 11.5822L5.33333 8H3.33333C3.33333 6.34976 3.825 4.76712 4.70017 3.60022C5.57534 2.43333 6.76232 1.77778 8 1.77778C9.23768 1.77778 10.4247 2.43333 11.2998 3.60022C12.175 4.76712 12.6667 6.34976 12.6667 8C12.6667 9.65024 12.175 11.2329 11.2998 12.3998C10.4247 13.5667 9.23768 14.2222 8 14.2222C6.71333 14.2222 5.54667 13.52 4.70667 12.3911L3.76 13.6533C4.84667 15.1111 6.33333 16 8 16C9.5913 16 11.1174 15.1571 12.2426 13.6569C13.3679 12.1566 14 10.1217 14 8C14 5.87827 13.3679 3.84344 12.2426 2.34315C11.1174 0.842855 9.5913 0 8 0Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Revert To Review
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2 cursor-pointer pt-2 border-b border-[#174B8B] flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.16016 17H15.0009"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2.24925 7.08754C1.46178 6.22567 1.11613 5.69893 1.01358 4.43391C0.916387 3.23499 1.35071 1.9988 2.0037 1.36731C2.91177 0.489144 3.99008 1.31537 4.59306 2.48019C5.2465 3.74247 5.81153 7.39155 5.85476 8.95648C5.90384 10.7333 5.67812 12.3476 5.09734 13.8921C4.69899 14.9513 4.1104 16.2 3.32699 16.623C2.61703 17.0063 1.84553 16.8634 1.70265 15.5666C1.52751 13.9772 2.01007 12.4287 2.53763 11.1151C3.2371 9.37351 4.12041 7.93155 5.34372 7.08754C10.0609 3.83281 7.27543 14.3129 8.83991 14.3129C10.4044 14.3129 10.5054 9.1645 11.6022 9.98748C12.6989 10.8105 10.6021 15.9217 14.5269 12.6917"
                            stroke="#174B8B"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Sign
                      </li>
                      <li
                        onClick={() => {
                          onClick(), toggleDropdown("signature");
                        }}
                        className="px-2 py-2  cursor-pointer   flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 60 80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M59.9996 12.236V77.2044C59.9996 78.744 58.7808 80 57.2867 80H7.27353C5.77943 80 4.56055 78.744 4.56055 77.2044V2.79564C4.56055 1.25601 5.77943 0 7.27353 0H48.1058L59.9996 12.236Z"
                            fill="white"
                          />
                          <path
                            d="M60.001 12.236V77.2044C60.001 78.744 58.7821 80 57.288 80H53.4151C54.9092 80 56.1281 78.744 56.1281 77.2044V12.236L44.2539 0H48.1268L60.001 12.236Z"
                            fill="#E5E5E5"
                          />
                          <path
                            d="M59.9993 12.236H50.8185C49.3244 12.236 48.1055 10.98 48.1055 9.44036V0L59.9993 12.236Z"
                            fill="#92929D"
                          />
                          <path
                            d="M48.5389 37.8827H16.337C15.2558 37.8827 14.3711 36.9711 14.3711 35.8569C14.3711 34.7427 15.2558 33.8311 16.337 33.8311H48.5389C49.6201 33.8311 50.5048 34.7427 50.5048 35.8569C50.5048 36.9913 49.6398 37.8827 48.5389 37.8827Z"
                            fill="#92929D"
                          />
                          <path
                            d="M48.5389 48.2753H16.337C15.2558 48.2753 14.3711 47.3637 14.3711 46.2495C14.3711 45.1353 15.2558 44.2236 16.337 44.2236H48.5389C49.6201 44.2236 50.5048 45.1353 50.5048 46.2495C50.5048 47.3839 49.6398 48.2753 48.5389 48.2753Z"
                            fill="#92929D"
                          />
                          <path
                            d="M48.5389 58.6679H16.337C15.2558 58.6679 14.3711 57.7562 14.3711 56.642C14.3711 55.5278 15.2558 54.6162 16.337 54.6162H48.5389C49.6201 54.6162 50.5048 55.5278 50.5048 56.642C50.5048 57.7765 49.6398 58.6679 48.5389 58.6679Z"
                            fill="#92929D"
                          />
                          <path
                            d="M27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H27.2281C28.0537 14.4238 28.7418 15.1126 28.7418 15.9837V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486Z"
                            fill="#F55B4B"
                          />
                          <path
                            d="M28.7418 25.5861V25.7887C28.7418 26.6396 28.0734 27.3486 27.2281 27.3486H0V15.9837C0 15.1329 0.668405 14.4238 1.51375 14.4238H2.28047V18.4755C2.28047 22.4056 5.36697 25.6064 9.20053 25.6064H28.7418V25.5861Z"
                            fill="#DD4E43"
                          />
                          <path
                            d="M0 27.3486L4.56094 32.6968V27.3486H0Z"
                            fill="#DB1B1B"
                          />
                          <path
                            d="M7.37246 23.3386V24.6959H3.26367V23.3386H4.26629V18.0106H3.26367V16.6533H7.37246C8.33576 16.6533 9.06315 16.8762 9.59395 17.3421C10.1248 17.808 10.3803 18.4361 10.3803 19.2059C10.3803 19.6515 10.282 20.0567 10.1051 20.4214C9.92816 20.786 9.69225 21.0696 9.39736 21.252C9.10247 21.4545 8.78792 21.5761 8.4144 21.6571C8.04087 21.7382 7.58871 21.7584 7.03825 21.7584H6.2912V23.3183H7.37246V23.3386ZM6.2912 20.4214H6.58609C7.27416 20.4214 7.72632 20.2998 7.92292 20.077C8.11951 19.8541 8.21781 19.5503 8.21781 19.2059C8.21781 18.9223 8.13916 18.6589 8.00155 18.4563C7.86393 18.2537 7.70667 18.1322 7.52973 18.0714C7.3528 18.0309 7.05791 17.9904 6.64507 17.9904H6.27154V20.4214H6.2912Z"
                            fill="white"
                          />
                          <path
                            d="M10.8516 24.6959V23.3386H12.0311V18.0106H10.8516V16.6533H14.5475C15.3339 16.6533 15.9433 16.6938 16.4348 16.7951C16.9066 16.8964 17.3588 17.1193 17.7913 17.4434C18.2238 17.7878 18.5777 18.2335 18.8332 18.8007C19.0888 19.3679 19.2264 19.9959 19.2264 20.6847C19.2264 21.252 19.1281 21.7787 18.9512 22.2851C18.7742 22.7916 18.5383 23.1967 18.2631 23.5209C17.9879 23.8248 17.6733 24.0881 17.2801 24.2704C16.9066 24.4528 16.5527 24.5743 16.2382 24.6351C15.9237 24.6959 15.4322 24.7161 14.7638 24.7161H10.8516V24.6959ZM14.0757 23.3386H14.5672C15.1569 23.3386 15.6288 23.2575 15.9826 23.0955C16.3365 22.9334 16.6117 22.6498 16.8083 22.2649C17.0246 21.8597 17.1229 21.3532 17.1229 20.705C17.1229 20.0972 17.0246 19.5705 16.8083 19.1451C16.5921 18.7197 16.3168 18.4158 15.9433 18.2537C15.5894 18.0917 15.1176 18.0106 14.5672 18.0106H14.0757V23.3386Z"
                            fill="white"
                          />
                          <path
                            d="M20.1309 24.6959V23.3386H21.2514V18.0106H20.1309V16.6533H27.1296V19.1451H25.6354V18.0309H23.296V19.8946H24.9867V21.252H23.296V23.3386H24.4952V24.6959H20.1309Z"
                            fill="white"
                          />
                          <path
                            d="M24.2393 31.1167H4.58008V27.3486H27.3258V27.9564C27.3062 29.6986 25.93 31.1167 24.2393 31.1167Z"
                            fill="#E5E5E5"
                          />
                        </svg>
                        Download PDF
                      </li>
                      <li
                        onClick={() => {
                          save(), toggleDropdown("signature");
                        }}
                        className="px-2 py-2 cursor-pointer  flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.336 0C15.512 0 15.6693 0.0666667 15.808 0.2C15.936 0.328 16 0.482667 16 0.664V13.336C16 13.5173 15.936 13.672 15.808 13.8C15.6693 13.9333 15.512 14 15.336 14H4.664C4.488 14 4.33067 13.9333 4.192 13.8C4.064 13.672 4 13.5173 4 13.336V11H0.664C0.488 11 0.330667 10.936 0.192 10.808C0.064 10.6693 0 10.512 0 10.336V3.664C0 3.488 0.064 3.33067 0.192 3.192C0.330667 3.064 0.488 3 0.664 3H4V0.664C4 0.482667 4.064 0.328 4.192 0.2C4.33067 0.0666667 4.488 0 4.664 0H15.336ZM4.024 6.472L4.984 9.624H6.08L7.128 4.376H6.024L5.4 7.48L4.512 4.48H3.6L2.648 7.496L2.024 4.376H0.872L1.92 9.624H3.016L4.024 6.472ZM15 13V11H5V13H15ZM15 10V7.504H8V10H15ZM15 6.504V4H8V6.504H15ZM15 3V1H5V3H15Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Download Word
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        style={{ whiteSpace: "nowrap" }}
                        className="px-2 py-2 cursor-pointer  border-b border-[#174B8B] flex items-center gap-x-1 no-wrap"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="18"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.7 16L9.1 15.1111L10.5 16V9.77778H7.7V16ZM10.5 5.33333V3.55556L9.1 4.44444L7.7 3.55556V5.33333L6.3 6.22222L7.7 7.11111V8.88889L9.1 8L10.5 8.88889V7.11111L11.9 6.22222L10.5 5.33333ZM12.6 0H1.4C1.0287 0 0.672601 0.187301 0.41005 0.520699C0.1475 0.854097 0 1.30628 0 1.77778V10.6667C0 11.1382 0.1475 11.5903 0.41005 11.9237C0.672601 12.2571 1.0287 12.4444 1.4 12.4444H6.3V10.6667H1.4V1.77778H12.6V10.6667H11.9V12.4444H12.6C12.9713 12.4444 13.3274 12.2571 13.5899 11.9237C13.8525 11.5903 14 11.1382 14 10.6667V1.77778C14 1.30628 13.8525 0.854097 13.5899 0.520699C13.3274 0.187301 12.9713 0 12.6 0ZM6.3 4.44444H2.1V2.66667H6.3V4.44444ZM4.9 7.11111H2.1V5.33333H4.9V7.11111ZM6.3 9.77778H2.1V8H6.3V9.77778Z"
                            fill="#174B8B"
                          />
                        </svg>
                        <span style={{ marginTop: "-2px", marginLeft: "2px" }}>
                          {" "}
                          Download Signature Certificate
                        </span>
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2 cursor-pointer flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4617 14.3223V10.4926C11.4617 10.2251 11.5549 9.96862 11.7208 9.77949C11.8867 9.59036 12.1117 9.48411 12.3464 9.48411C12.581 9.48411 12.806 9.59036 12.9719 9.77949C13.1378 9.96862 13.231 10.2251 13.231 10.4926V14.945C13.2354 15.2131 13.1929 15.4795 13.106 15.7286C13.019 15.9778 12.8894 16.2047 12.7246 16.3961C12.5598 16.5874 12.3633 16.7395 12.1464 16.8432C11.9295 16.947 11.6966 17.0005 11.4614 17.0005C11.2261 17.0005 10.9933 16.947 10.7764 16.8432C10.5595 16.7395 10.3629 16.5874 10.1981 16.3961C10.0334 16.2047 9.90373 15.9778 9.81677 15.7286C9.72982 15.4795 9.68731 15.2131 9.69172 14.945V10.0564C9.69172 9.25385 9.9714 8.48413 10.4692 7.91662C10.9671 7.3491 11.6423 7.03027 12.3464 7.03027C13.0504 7.03027 13.7256 7.3491 14.2235 7.91662C14.7213 8.48413 15.001 9.25385 15.001 10.0564V14.3223"
                            stroke="#174B8B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.68791 14.8294H1.9332C1.6857 14.8294 1.44834 14.7173 1.27333 14.5178C1.09832 14.3183 1 14.0478 1 13.7656V2.0638C1 1.78166 1.09832 1.51108 1.27333 1.31158C1.44834 1.11208 1.6857 1 1.9332 1H8.54583C8.79315 1.00006 9.03034 1.11204 9.20529 1.31134L10.992 3.34817C11.1669 3.54759 11.2651 3.81798 11.2652 4.09992V4.95096"
                            stroke="#174B8B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Add Attachments
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        style={{ whiteSpace: "nowrap" }}
                        className="px-2 py-2 border-b border-[#174B8B] cursor-pointer flex items-center gap-x-2 no-wrap"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.75 0H1.75C0.77875 0 0 0.72 0 1.6V14.4C0 15.288 0.77875 16 1.75 16H12.25C13.2212 16 14 15.288 14 14.4V4.8L8.75 0ZM12.25 14.4H1.75V1.6H7.875V5.6H12.25V14.4ZM6.125 13.6H5.90625C4.76875 13.6 2.625 12.976 2.625 10.6C2.625 8.224 4.76875 7.6 5.90625 7.6H6.125V8.8H5.90625C5.5825 8.8 3.9375 8.904 3.9375 10.6C3.9375 12.352 5.6875 12.4 5.90625 12.4H6.125V13.6ZM8.75 11.2H5.25V10H8.75V11.2ZM7.875 7.6H8.09375C9.23125 7.6 11.375 8.224 11.375 10.6C11.375 12.976 9.23125 13.6 8.09375 13.6H7.875V12.4H8.09375C8.4175 12.4 10.0625 12.296 10.0625 10.6C10.0625 8.848 8.3125 8.8 8.09375 8.8H7.875V7.6Z"
                            fill="#174B8B"
                          />
                        </svg>
                        View Linked Documents
                      </li>
                      <li
                        onClick={() => {
                          toggleDropdown("signature");
                        }}
                        className="px-2 py-2  cursor-pointer  flex items-center gap-x-2"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#E4EDF8")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "initial")
                        }
                      >
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 14.2222C1 14.6937 1.21071 15.1459 1.58579 15.4793C1.96086 15.8127 2.46957 16 3 16H11C11.5304 16 12.0391 15.8127 12.4142 15.4793C12.7893 15.1459 13 14.6937 13 14.2222V3.55556H1V14.2222ZM3 5.33333H11V14.2222H3V5.33333ZM10.5 0.888889L9.5 0H4.5L3.5 0.888889H0V2.66667H14V0.888889H10.5Z"
                            fill="#174B8B"
                          />
                        </svg>
                        Move to Bin
                      </li>
                      <div
                        onClick={() => toggleDropdown("signature")}
                        className="w-full h-full  fixed inset-0 z-[-9]"
                      ></div>
                    </ul>
                  )}
                </div> */}
                <div className="border-docs color-docs">
                  <span
                    className="text-[14px] font-regular flex whitespace-nowrap cursor-pointer "
                    onClick={() => {
                      setSelectedModule("approval"), setSidebarExpanded(true);
                    }}
                  >
                    Approvals:{" "}
                    {
                      approvers.filter((recipient: any) => recipient.signature)
                        .length
                    }
                    /{approvers.length}
                  </span>
                </div>

                <div className="border-docs color-docs">
                  <span
                    className="text-[14px] font-regular flex whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setSelectedModule("signature"), setSidebarExpanded(true);
                    }}
                  >
                    Signers:{" "}
                    {
                      recipients.filter((recipient: any) => recipient.signature)
                        .length
                    }
                    /{recipients.length}
                  </span>
                </div>

                <div className="border-docs color-docs">
                  <span
                    className="text-[14px] font-regular flex whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setSelectedModule("share");
                      setSidebarExpanded(true);
                    }}
                  >
                    Shared With:{" "}
                    {collaborater?.filter((dt: any) => dt.permission).length}/
                    {collaborater?.length}
                  </span>
                </div>

                <div className="border-docs color-docs">
                  <span
                    className="text-[14px] font-regular flex whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setSelectedModule("fields"), setSidebarExpanded(true);
                    }}
                  >
                    Fields: 0/0{" "}
                  </span>
                </div>
              </>
            )}
          </Box>
        </div>

        <div
          ref={div2Ref}
          className="w-full flex"
          style={{
            borderTop:
              showBlock == "uploadTrack" ? "1px solid #174B8B" : "none",
            background: "#f7f7f7",
            padding: "5px 0",
          }}
        >
          {IsTemplate ? (
            <ListItemButton
              sx={{
                mt: 1,
                pl: 2, // Adjust padding left value as needed
                fontSize: "10px",
              }}
            >
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor: "#FFAA04",
                  borderRadius: "50%",
                  marginRight: "10px",
                  alignSelf: "center",
                }}
              />
              <ListItemText
                sx={{
                  fontSize: "10px",
                  color: "#1976d2",
                }}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  fontSize: "16px",
                  color: "#155be5",
                }}
                primary="Template"
              />
            </ListItemButton>
          ) : (
            (showBlock === "" || showBlock === "pdf") && (
              <>
                <div
                  className="color-docs2"
                  style={{ marginTop: 9, marginLeft: 4 }}
                >
                  <Breadcrumb recipients={recipients} />
                </div>
              </>
            )
          )}
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{
              marginRight: 55,
              marginLeft: 40,
            }}
          >
            File
          </div>
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{ marginRight: 55 }}
          >
            View
          </div>
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{ marginRight: 55 }}
          >
            Insert
          </div>
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{ marginRight: 55 }}
          >
            Signature
          </div>
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{ marginRight: 55 }}
          >
            Export
          </div>
          <div
            className="align-self-center mt-1 text-[14px] color-docs2"
            style={{ marginRight: 55 }}
          >
            Attach
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "1rem",
              marginTop: ".5rem",
              marginBottom: ".5rem",
              marginLeft: 8,
              width: "100%",
            }}
          >
            {(showBlock == "uploadTrack" || editMode) && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  className="cancel-btn"
                  sx={{
                    ml: 2,
                    textTransform: "none",
                    color: "#43464C",
                    borderRadius: "5px",
                    background: "#fefefe",
                    border: "1px solid #EEE",
                    height: 30,
                    width: 55,
                    minWidth: 55,
                    minHeight: 30,
                    fontSize: "13px",
                  }}
                  onClick={() => {
                    handleClickCencel();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    ml: 1,
                    textTransform: "none",
                    color: "#43464C",
                    borderRadius: "5px",
                    background: "#fefefe",
                    border: "1px solid #EEE",
                    height: 30,
                    width: 40,
                    minWidth: 40,
                    minHeight: 30,
                    fontSize: "13px",
                  }}
                  className="save-btn"
                  onClick={() => {
                    handleSubmit();
                    // if (showBlock !== "uploadTrack") {
                    //   handleClickCencel();
                    // }
                  }}
                  variant="outlined"
                  color="success"
                >
                  Save
                </Button>
              </>
            )}

            {showBlock == "pdf" && (
              <Button
                sx={{ ml: 2, textTransform: "none" }}
                type="submit"
                variant="outlined"
                color="success"
                onClick={() => {
                  setSidebarExpanded(true), setSelectedModule("fields");
                }}
              >
                Add Field
              </Button>
            )}

            {showBlock == "" && !editMode && (
              <Button
                variant="outlined"
                color="primary"
                className="btn-edit color-docs2 d-flex align-items-center"
                sx={{
                  textTransform: "none",
                  color: "#43464C",
                  borderRadius: "5px",
                  background: "#fefefe",
                  border: "1px solid #EEE",
                  height: 30,
                  width: 52,
                  padding: "4px",
                  fontSize: "13px",
                  minHeight: 30,
                  minWidth: 52,
                }}
                onClick={() => {
                  handleClick();
                }}
              >
                <span style={{ paddingRight: "8px" }}>
                  <EditIconSvg />
                </span>
                <span
                  style={{ fontSize: 13, position: "relative", right: "3px" }}
                >
                  Edit
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* <div id="xyz">show </div> */}
        {showBlock == "uploadTrack" && uplodTrackFile && (
          <div>
            <PDFUploaderViewer documentPath={uplodTrackFile} />
            {
              // uplodTrackFile && uplodTrackFile.type === "application/pdf" && (
              // <div className="  w-full h-[75vh] bg-white overflow-auto  px-4 py-3">
              //   <div className="max-w-[930px] w-full mx-auto">
              //     <Worker workerUrl={workerUrl}>
              //       <Viewer fileUrl={URL.createObjectURL(uplodTrackFile)} />
              //     </Worker>
              //   </div>
              // </div>
              // )
              // : (
              //   <div className="w-full h-[70vh] bg-white overflow-auto ">
              //     <div className="max-w-[835px] w-full mx-auto px-4 py-4 ">
              //       <div
              //         className="w-full border-2 min-h-[600px]  px-28 py-28"
              //         dangerouslySetInnerHTML={{ __html: documentContent }}
              //       />
              //     </div>
              //   </div>
              // )
            }
          </div>
        )}

        {documentContent == "pdf" && (
          <PDFUploaderViewer documentPath={documentPath} />
        )}

        <div
          ref={div3Ref}
          style={{
            backgroundColor: "#fefefe",
            border: "1px solid #fefefe",
            height: 38,
            // position:"relative"
          }}
        >
        <QuillToolbar
          pages={pages}
          setPages={setPages}
          isBoldActive={isBoldActive}
          setIsBoldActive={setIsBoldActive}
          isItalicActive={isItalicActive}
          setIsItalicActive={setIsItalicActive}
          isUnderlineActive={isUnderlineActive}
          setIsUnderlineActive={setIsUnderlineActive}
          isStrikeActive={isStrikeActive}
          setIsStrikeActive={setIsStrikeActive}
          isScriptActive={isScriptActive}
          setIsScriptActive={setIsScriptActice}
          isListActive={isListActive}
          setIsListActive={setIsListActive}
          handleChangeSelection={handleChangeSelection}
          scrollPageRef={scrollPageRef}
          editorZoom={editorZoom}
          setEditorZoom={setEditorZoom}
        />

        </div>

        {(showBlock === "" || documentContent == "word") && (
          <div
            style={{
              height: "100%",
              background: "rgb(247, 247, 247)",
            }}
          >
            <div
              style={{
                overflowX: "auto", // Allows horizontal scrolling if necessary
                overflowY: "auto", // Allows vertical scrolling if necessary
                height: `${remainingVh +1}vh`,
              }}
              onClick={() => {
                setAddReply({
                  open: false,
                  id: "",
                });
                SetOpenComment(false);
                if (editorRefs && commentSelection) {
                  const editor = editorRefs.current[currentPage].getEditor();
                  const { index, length } = commentSelection;
                  editor.formatText(index, length, {
                    background: commentPrevBg,
                  });
                }
              }}
            >
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                style={{
                  height: "100%",
                  overflowY: "auto",
                  zoom:editorZoom == "100%" ? "100%" : editorZoom == "75%" ? "75%" : editorZoom == "125%" ? "125%" : editorZoom == "150%" ? "150%" : editorZoom == "175%" ? "175%" :editorZoom  
                }}
                ref={scrollPageRef}
              >
                <Grid
                  item
                  style={{
                    height: "100%",
                    position: "relative",
                    // width: documentPageSize?.title === "Landscape" ? "90%" : "",
                  }}
                >
                  {console.log("Rendering pages:", pages)}
                  {pages.map((page, index) => (
                        page && (
                          <div
                            key={index}
                            ref={(el) => (containerRefs.current[index] = el)}
                        style={{
                          marginBottom: index > 0 ? "20px" : "0px",
                          borderRadius: "5px",
                          width: "100%",
                          minHeight: `${documentPageSize.height}`,
                        }}
                      >
                        <ReactQuill
                          value={pages[index]?.content}
                          onChange={(value, delta, source, editor) => handleChange(value, delta, source, editor, index)}
                          ref={(ref) => (editorRefs.current[index] = ref)}
                          readOnly={!editMode}
                          onChangeSelection={handleChangeSelection}
                          modules={modules}
                          formats={formats}
                          onKeyDown={(event) => handleKeyDown(event, index)}
                          onFocus={() => {
                            setEditorRefContext(editorRefs.current[index]);
                            setCurrentPage(index);
                          }}
                          theme="snow"
                          style={{
                            border: "1px solid #f2f2f2",
                            borderRadius: "5px",
                            background: "#fefefe",
                            width: documentPageSize.width,
                            height: documentPageSize.height,
                            margin: "20px 0",
                          }}
                        />
                        <style>
                          {`
                            .ql-editor {
                             min-height: 375px;
                             padding-top: ${documentPageMargins.top} !important;
                             padding-bottom: ${documentPageMargins.bottom} !important;
                             padding-left: ${documentPageMargins.left} !important;
                             padding-right: ${documentPageMargins.right} !important;                        
                             } 
                           `}
                        </style>
                      </div>
                    )
                  ))}

                  {selection && (
                    <Tooltip title="Add Commment">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editorRefs) {
                            const editor =
                              editorRefs.current[currentPage].getEditor();
                            const range = editor.getSelection();
                            const format = editor.getFormat(
                              range.index,
                              range.length
                            );
                            setCommentPrevBg(format.background);
                            setCommentSelection(range);
                            editor.formatText(range.index, range.length, {
                              background: "#e1ecff",
                            });
                          }
                          SetOpenComment(true);
                        }}
                        style={{
                          position: "absolute",
                          top: `${buttonPosition.top}px`,
                          left: `${commentLeftButton}`,
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.25 15C5.05109 15 4.86032 14.921 4.71967 14.7803C4.57902 14.6397 4.5 14.4489 4.5 14.25V12H1.5C1.10218 12 0.720644 11.842 0.43934 11.5607C0.158035 11.2794 0 10.8978 0 10.5V1.5C0 0.6675 0.675 0 1.5 0H13.5C13.8978 0 14.2794 0.158035 14.5607 0.43934C14.842 0.720644 15 1.10218 15 1.5V10.5C15 10.8978 14.842 11.2794 14.5607 11.5607C14.2794 11.842 13.8978 12 13.5 12H8.925L6.15 14.7825C6 14.925 5.8125 15 5.625 15H5.25ZM6 10.5V12.81L8.31 10.5H13.5V1.5H1.5V10.5H6Z"
                            fill="#174B8B"
                          />
                        </svg>
                      </button>
                    </Tooltip>
                  )}
                  {openComment && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="px-1 comment-container"
                      style={{
                        top: `${buttonPosition.top}px`,
                      }}
                    >
                      <div className="float-right py-1">
                        <CrossImage />
                      </div>
                      <div className="m-2 py-2 px-1 comment-user-info">
                        <div className="icon-person mx-2">
                          {user?.firstName
                            ? user.firstName
                              .split(" ")
                              .map((name: string) => name.charAt(0))
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                            : user?.email
                              ?.split(" ")
                              .map((e: string) => e.charAt(0))
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                        </div>
                        <div
                          style={{ position: "relative", bottom: 3, right: 3 }}
                        >
                          <b
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {user?.firstName || user?.email}
                          </b>
                          <div style={{ fontSize: 13, margin: 0 - 2 }}>
                            {isInternal ? (
                              <span className="d-flex align-items-center">
                                <Internal />
                                <span className="mx-1 bottom-1">Internal</span>
                              </span>
                            ) : (
                              <span className="d-flex align-items-center">
                                <Public />
                                <span className="mx-1 bottom-1">Public</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-center pt-2"
                        style={{ margin: "0 -4px" }}
                      >
                        <textarea
                          name="comment"
                          placeholder="Start a conversation"
                          rows={1}
                          ref={commentInputRef}
                          value={currentComment}
                          onChange={(e) => setCurrentComment(e.target.value)}
                          className="input-comment"
                        />
                      </div>
                      <div className="py-2 d-flex px-1">
                        <Tooltip title="Only visible by you and your company's users">
                          <div
                            className="outline-btn-comment"
                            style={{
                              background: isInternal ? "#FFFFFF" : "",
                            }}
                            onClick={() => {
                              setIsPublic(false);
                              setIsInternal(true);
                            }}
                          >
                            <span>
                              <Internal />
                            </span>
                            <span
                              style={{ fontSize: 14 }}
                              className="px-1 bottom-1"
                            >
                              Internal
                            </span>
                          </div>
                        </Tooltip>
                        <Tooltip title="Visible by everyone including external users">
                          <div
                            className="outline-btn-comment"
                            style={{
                              background: isPublic ? "#FFFFFF" : "",
                            }}
                            onClick={() => {
                              setIsPublic(true);
                              setIsInternal(false);
                            }}
                          >
                            <span>
                              <Public />
                            </span>
                            <span
                              style={{ fontSize: 14 }}
                              className="mx-1 bottom-1"
                            >
                              Public
                            </span>
                          </div>
                        </Tooltip>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            width: "100%",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor:
                                currentComment.trim().length === 0
                                  ? "#174B8B80"
                                  : "#174B8B",
                              border: "1px solid #174B8B80",
                              color: "white",
                              borderRadius: 5,
                              padding: 1,
                              fontSize: 13,
                            }}
                            disabled={
                              currentComment.trim().length === 0 ? true : false
                            }
                            onClick={addComment}
                          >
                            <b>Comment</b>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    {comments?.map((e: any, indexComment: number) => {
                      const isInternal = e.access === "Internal";
                      if (isInternal && recipients.length === 0) {
                        return null;
                      }
                      return (
                        <div
                          key={indexComment}
                          className="comments"
                          style={{
                            top: `${e.style.top}px`,
                            background: "#E1ECFF",
                            // top:
                            //   openComment && e?.replies?.length > 0
                            //     ? "-18rem"
                            //     : openComment
                            //     ? "-51px"
                            //     : `${e.style.top}px`,
                          }}
                        >
                          <div className="comments-upper-section">
                            <div className="d-flex justify-content-between algin-items-center pt-2">
                              <div className="d-flex">
                                <div className="icon-person mx-1">
                                  {e.user
                                    ?.split(" ")
                                    .map((e: any) => e.charAt(0))
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <b
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {e.user}
                                  </b>
                                  <div
                                    style={{
                                      fontSize: 14,
                                    }}
                                  >
                                    {e.access === "Internal" ? (
                                      <span className="d-flex">
                                        <Internal />
                                        <span className="bottom-2 mx-1">
                                          Internal
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="d-flex">
                                        <Public />
                                        <span className="bottom-2 mx-1">
                                          Public
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  {editCommentIndex !== indexComment && (
                                    <span
                                      style={{
                                        color: "#00000080",
                                      }}
                                    >
                                      {e?.date?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <img
                                    src={OptionImage}
                                    className="position-options"
                                    alt="Options"
                                    onClick={(event) =>
                                      handleOpenOptionsMenu(event, indexComment)
                                    }
                                  />
                                  <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button",
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() =>
                                        handleEditComment(indexComment)
                                      }
                                    >
                                      Edit comment
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      Resolve thread
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      Delete thread
                                    </MenuItem>
                                  </Menu>
                                </div>
                              </div>
                            </div>
                            {editComment &&
                              editCommentIndex === indexComment ? (
                              <>
                                <div className="px-3" style={{ width: "100%" }}>
                                  <textarea
                                    name="comment"
                                    placeholder="Start a conversation"
                                    rows={1}
                                    ref={commentInputRef}
                                    value={currentComment}
                                    onChange={(e) =>
                                      setCurrentComment(e.target.value)
                                    }
                                    className="input-comment-update"
                                  />
                                </div>
                                <div
                                  className="d-flex justify-content-end px-2"
                                  style={{ paddingBottom: 10 }}
                                >
                                  <button
                                    style={{
                                      backgroundColor:
                                        currentComment.trim().length === 0
                                          ? "#174B8B80"
                                          : "#174B8B",
                                      border: "1px solid #174B8B80",
                                      color: "white",
                                      borderRadius: 5,
                                      padding: 1,
                                      fontSize: 13,
                                    }}
                                    disabled={
                                      currentComment.trim().length === 0
                                        ? true
                                        : false
                                    }
                                    onClick={addComment}
                                  >
                                    <b>Update</b>
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div
                                style={{ margin: "0 2rem" }}
                                className="pb-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAddReply({ open: true, id: indexComment });
                                }}
                              >
                                <span
                                  style={{
                                    wordBreak: "break-word",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {e.text}
                                </span>
                              </div>
                            )}
                          </div>

                          {e?.replies &&
                            e?.replies?.map((reply: any, index: any) => {
                              return (
                                <div className="replies">
                                  <div className="comments-upper-section">
                                    <div className="d-flex justify-content-between algin-items-center pt-2">
                                      <div className="d-flex">
                                        <div className="icon-person mx-1">
                                          {reply.user
                                            ?.split(" ")
                                            .map((e: any) => e.charAt(0))
                                            .join("")
                                            .substring(0, 2)
                                            .toUpperCase()}
                                        </div>
                                        <div>
                                          <b
                                            style={{
                                              fontSize: 14,
                                            }}
                                          >
                                            {e.user}
                                          </b>
                                          <div
                                            style={{
                                              fontSize: 14,
                                            }}
                                          >
                                            {e.access === "Internal" ? (
                                              <span className="d-flex">
                                                <Internal />
                                                <span className="bottom-2 mx-1">
                                                  Internal
                                                </span>
                                              </span>
                                            ) : (
                                              <span className="d-flex">
                                                <Public />
                                                <span className="bottom-2 mx-1">
                                                  Public
                                                </span>
                                              </span>
                                            )}
                                          </div>
                                          {editCommentIndex !==
                                            indexComment && (
                                              <span
                                                style={{
                                                  color: "#00000080",
                                                }}
                                              >
                                                {reply?.date?.toLocaleString()}
                                              </span>
                                            )}
                                        </div>
                                        <div>
                                          <img
                                            src={OptionImage}
                                            className="position-options"
                                            alt="Options"
                                            onClick={(event) =>
                                              handleOpenOptionsMenu(
                                                event,
                                                indexComment
                                              )
                                            }
                                          />
                                          <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                              "aria-labelledby": "basic-button",
                                            }}
                                          >
                                            <MenuItem
                                              onClick={() =>
                                                handleEditComment(indexComment)
                                              }
                                            >
                                              Edit comment
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                              Resolve thread
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                              Delete thread
                                            </MenuItem>
                                          </Menu>
                                        </div>
                                      </div>
                                    </div>
                                    {editComment &&
                                      editCommentIndex === indexComment ? (
                                      <>
                                        <div
                                          className="px-3"
                                          style={{ width: "100%" }}
                                        >
                                          <textarea
                                            name="comment"
                                            placeholder="Start a conversation"
                                            rows={1}
                                            ref={commentInputRef}
                                            value={currentComment}
                                            onChange={(e) =>
                                              setCurrentComment(e.target.value)
                                            }
                                            className="input-comment-update"
                                          />
                                        </div>
                                        <div
                                          className="d-flex justify-content-end px-2"
                                          style={{ paddingBottom: 10 }}
                                        >
                                          <button
                                            style={{
                                              backgroundColor:
                                                currentComment.trim().length ===
                                                  0
                                                  ? "#174B8B80"
                                                  : "#174B8B",
                                              border: "1px solid #174B8B80",
                                              color: "white",
                                              borderRadius: 5,
                                              padding: 1,
                                              fontSize: 13,
                                            }}
                                            disabled={
                                              currentComment.trim().length === 0
                                                ? true
                                                : false
                                            }
                                            onClick={addComment}
                                          >
                                            <b>Update</b>
                                          </button>
                                        </div>
                                      </>
                                    ) : (
                                      <div
                                        style={{ margin: "0 2rem" }}
                                        className="pb-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setAddReply({
                                            open: true,
                                            id: indexComment,
                                          });
                                        }}
                                      >
                                        <span
                                          style={{
                                            wordBreak: "break-word",
                                            whiteSpace: "pre-wrap",
                                          }}
                                        >
                                          {reply.text}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          {editCommentIndex !== indexComment && (
                            <div
                              id={`reply-${indexComment}`}
                              onClick={(e) => e.stopPropagation()}
                              className="add-reply-container"
                            >
                              <div className="d-flex align-items-center justify-content-around px-1">
                                <textarea
                                  name="Reply"
                                  placeholder="Reply"
                                  rows={1}
                                  value={reply[indexComment]}
                                  onChange={(e) =>
                                    handleReplyChange(
                                      indexComment,
                                      e.target.value
                                    )
                                  }
                                  className="input-comment"
                                  onFocus={() => {
                                    setIsFocusedInput(true);
                                  }}
                                  onBlur={() => setIsFocusedInput(false)}
                                />

                                {reply[indexComment]?.length > 0 && (
                                  <svg
                                    onClick={() => {
                                      setReply((prevReplies: any) => ({
                                        ...prevReplies,
                                        [indexComment]: ``,
                                      }));
                                    }}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    width="9"
                                    height="9"
                                    viewBox="0 0 6 6"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6 0.632473L5.36753 0L3 2.36753L0.632473 0L0 0.632473L2.36753 3L0 5.36753L0.632473 6L3 3.63247L5.36753 6L6 5.36753L3.63247 3L6 0.632473Z"
                                      fill="black"
                                    />
                                  </svg>
                                )}
                              </div>

                              {reply[indexComment]?.length > 0 && (
                                <div
                                  className="d-flex justify-content-end px-3"
                                  style={{
                                    marginTop: 10,
                                  }}
                                >
                                  <button
                                    style={{
                                      backgroundColor:
                                        reply[indexComment]?.trim().length === 0
                                          ? "#174B8B80"
                                          : "#174B8B",
                                      border: "1px solid #174B8B80",
                                      color: "white",
                                      borderRadius: 5,
                                      padding: 1,
                                      fontSize: 13,
                                    }}
                                    disabled={
                                      reply[indexComment].trim().length === 0
                                        ? true
                                        : false
                                    }
                                    onClick={() => handleReply(indexComment)}
                                  >
                                    <b>Comment</b>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Grid>
                {/* <Grid item xs={3.8}>
                  <TrackChanges rejectChange={rejectChange} />
                </Grid> */}
              </Grid>
            </div>
            <div >
              <EditorFooter width={footerWidth} editorZoom = {editorZoom} setEditorZoom={setEditorZoom}/>
            </div>
          </div>
        )}
        <Dialog
          open={temlatePoupup}
          onClose={() => setTemlatePoupup(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiPaper-root": {
              // Targeting the Paper component inside the Dialog
              border: "1.5px dashed #174B8B", // Customizing the border to dashed
              borderRadius: "16px", // Adding border radius
            },
          }}
        >
          <DialogContent
            sx={{
              maxHeight: "30vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              lineHeight: "auto",
            }}
          >
            <svg
              width="76"
              height="80"
              viewBox="0 0 76 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47.5 0L76 24V72C76 74.1217 74.9991 76.1566 73.2175 77.6569C71.4359 79.1571 69.0196 80 66.5 80H9.5C6.98044 80 4.56408 79.1571 2.78249 77.6569C1.00089 76.1566 0 74.1217 0 72V8C0 5.87827 1.00089 3.84344 2.78249 2.34315C4.56408 0.842854 6.98044 0 9.5 0H47.5ZM66.5 72V28H42.75V8H9.5V72H66.5ZM38 40L57 56H45.125V68H30.875V56H19L38 40Z"
                fill="#174B8B"
              />
            </svg>
            <Typography variant="subtitle2" color="black" sx={{ my: 2 }}>
              Browse to openFile
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                float: "right",
                marginTop: "8px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  mt: "4",
                  backgroundColor: "#174B8B", // Set the button color to green
                  "&:hover": {
                    backgroundColor: "#2B6EC2", // Darker green on hover
                  },
                }}
                onClick={() => {
                  triggerClick("container_toolbar_open"),
                    setTemlatePoupup(false);
                }}
              >
                Browse
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <SyncFesionFileDilog
          open={showPopup}
          onClose={() => setShowPopup(false)}
          setDocumentPath={setDocumentPath}
          documentPath={documentPath}
          triggerClick={() => triggerClick("container_toolbar_open")}
        />
      </div>
    </>
  );
}

export default SyncFesion;