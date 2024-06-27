import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useEffect, useLayoutEffect, useState } from "react";
import * as React from "react";
import { createPortal } from "react-dom";
import { OPEN_FLOATING_COMPOSER_COMMAND } from "@liveblocks/react-lexical";
import type { LexicalEditor, LexicalNode } from "lexical";
import { $isTextNode } from "lexical";
import {
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import { BoldIcon } from "../icons/BoldIcon";
import { CommentIcon } from "../icons/CommentIcon";
import { AIToolbar } from "./AIToolbar";

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    editor.registerUpdateListener(({ tags }) => {
      return editor.getEditorState().read(() => {
        // Ignore selection updates related to collaboration
        if (tags.has("collaboration")) return;

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setRange(null);
          return;
        }

        const { anchor, focus } = selection;

        const range = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset
        );

        setRange(range);
      });
    });
  }, [editor]);

  if (range === null) return null;

  return (
    <Toolbar range={range} onRangeChange={setRange} container={document.body} />
  );
}

function Toolbar({
  range,
  onRangeChange,
  container,
}: {
  range: Range;
  onRangeChange: (range: Range | null) => void;
  container: HTMLElement;
}) {
  const padding = 20;
  const [fullWidth, setFullWidth] = useState(false);
  const [editor] = useLexicalComposerContext();

  const {
    refs: { setReference, setFloating },
    strategy,
    x,
    y,
  } = useFloating({
    strategy: "fixed",
    placement: "bottom",
    middleware: [
      flip({ padding, crossAxis: false }),
      offset(10),
      hide({ padding }),
      shift({ padding, limiter: limitShift() }),
      size({ padding }),
    ],
    whileElementsMounted: (...args) => {
      return autoUpdate(...args, {
        animationFrame: true,
      });
    },
  });

  useLayoutEffect(() => {
    setReference({
      getBoundingClientRect: () => range.getBoundingClientRect(),
    });
  }, [setReference, range]);

  return createPortal(
    <div
      ref={setFloating}
      className="pointer-events-none"
      style={
        fullWidth && editor._rootElement
          ? {
              position: strategy,
              top: 0,
              left: editor._rootElement.getBoundingClientRect().left + 30,
              transform: `translate3d(0, ${Math.round(y)}px, 0)`,
              width: editor._rootElement.getBoundingClientRect().width - 30 * 2,
            }
          : {
              position: strategy,
              top: 0,
              left: 0,
              transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
              minWidth: "max-content",
            }
      }
    >
      <ToolbarOptions
        onRangeChange={onRangeChange}
        setFullWidth={setFullWidth}
      />
    </div>,
    container
  );
}

function ToolbarOptions({
  onRangeChange,
  setFullWidth,
}: {
  onRangeChange: (range: Range | null) => void;
  setFullWidth: (isFullWidth: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<"default" | "ai">("default");

  return (
    <div className="w-full text-foreground text-sm leading-relaxed">
      <div style={{ display: state === "ai" ? "block" : "none" }}>
        <AIToolbar
          state={state}
          setState={setState}
          onClose={() => onRangeChange(null)}
        />
      </div>

      <div
        style={{ display: state !== "ai" ? "block" : "none" }}
        className="flex items-center justify-center gap-2 p-1.5 rounded-lg border shadow border-border/80 bg-card pointer-events-auto"
      >
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setState("ai");
            setFullWidth(true);
          }}
          className="inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8 data-[active]:bg-accent"
        >
          AI
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            setState("default");
            setFullWidth(false);
          }}
          className="inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8 data-[active]:bg-accent"
        >
          <BoldIcon />
        </button>

        <button
          onClick={() => {
            const isOpen = editor.dispatchCommand(
              OPEN_FLOATING_COMPOSER_COMMAND,
              undefined
            );
            if (isOpen) {
              onRangeChange(null);
            }
            setState("default");
            setFullWidth(false);
          }}
          className="inline-flex relative items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-8 h-8 data-[active]:bg-accent"
        >
          <CommentIcon />
        </button>
      </div>
    </div>
  );
}

/**
 * MIT License
 * Copyright (c) Meta Platforms, Inc. and affiliates.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function getDOMTextNode(element: Node | null): Text | null {
  let node = element;

  while (node !== null) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node as Text;
    }

    node = node.firstChild;
  }

  return null;
}

function getDOMIndexWithinParent(node: ChildNode): [ParentNode, number] {
  const parent = node.parentNode;

  if (parent === null) {
    throw new Error("Should never happen");
  }

  return [parent, Array.from(parent.childNodes).indexOf(node)];
}

/**
 * Creates a selection range for the DOM.
 * @param editor - The lexical editor.
 * @param anchorNode - The anchor node of a selection.
 * @param _anchorOffset - The amount of space offset from the anchor to the focus.
 * @param focusNode - The current focus.
 * @param _focusOffset - The amount of space offset from the focus to the anchor.
 * @returns The range of selection for the DOM that was created.
 */
export function createDOMRange(
  editor: LexicalEditor,
  anchorNode: LexicalNode,
  _anchorOffset: number,
  focusNode: LexicalNode,
  _focusOffset: number
): Range | null {
  const anchorKey = anchorNode.getKey();
  const focusKey = focusNode.getKey();
  const range = document.createRange();
  let anchorDOM: Node | Text | null = editor.getElementByKey(anchorKey);
  let focusDOM: Node | Text | null = editor.getElementByKey(focusKey);
  let anchorOffset = _anchorOffset;
  let focusOffset = _focusOffset;

  if ($isTextNode(anchorNode)) {
    anchorDOM = getDOMTextNode(anchorDOM);
  }

  if ($isTextNode(focusNode)) {
    focusDOM = getDOMTextNode(focusDOM);
  }

  if (
    anchorNode === undefined ||
    focusNode === undefined ||
    anchorDOM === null ||
    focusDOM === null
  ) {
    return null;
  }

  if (anchorDOM.nodeName === "BR") {
    [anchorDOM, anchorOffset] = getDOMIndexWithinParent(anchorDOM as ChildNode);
  }

  if (focusDOM.nodeName === "BR") {
    [focusDOM, focusOffset] = getDOMIndexWithinParent(focusDOM as ChildNode);
  }

  const firstChild = anchorDOM.firstChild;

  if (
    anchorDOM === focusDOM &&
    firstChild !== null &&
    firstChild.nodeName === "BR" &&
    anchorOffset === 0 &&
    focusOffset === 0
  ) {
    focusOffset = 1;
  }

  try {
    range.setStart(anchorDOM, anchorOffset);
    range.setEnd(focusDOM, focusOffset);
  } catch (e) {
    return null;
  }

  if (
    range.collapsed &&
    (anchorOffset !== focusOffset || anchorKey !== focusKey)
  ) {
    // Range is backwards, we need to reverse it
    range.setStart(focusDOM, focusOffset);
    range.setEnd(anchorDOM, anchorOffset);
  }

  return range;
}