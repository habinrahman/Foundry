"use client";

import { useCallback, useRef, useState } from "react";

export interface FileDropState {
  isDragging: boolean;
  error: string | null;
  file: File | null;
  bind: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  openFilePicker: () => void;
  inputProps: {
    ref: React.RefObject<HTMLInputElement | null>;
    type: "file";
    accept: string;
    className: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  clear: () => void;
}

const DEFAULT_ACCEPT = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pdf",
  ".docx",
];

export function useFileDrop(options?: {
  accept?: string[];
  maxSizeMb?: number;
  onFile?: (file: File) => void;
}): FileDropState {
  const accept = options?.accept ?? DEFAULT_ACCEPT;
  const maxSizeMb = options?.maxSizeMb ?? 8;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const dragDepth = useRef(0);

  const validate = useCallback(
    (next: File): string | null => {
      const lower = next.name.toLowerCase();
      const okExt = lower.endsWith(".pdf") || lower.endsWith(".docx");
      const okMime =
        accept.includes(next.type) ||
        next.type === "" ||
        next.type === "application/octet-stream";
      if (!okExt && !okMime) return "Please upload a PDF or DOCX resume.";
      if (next.size > maxSizeMb * 1024 * 1024) {
        return `File must be under ${maxSizeMb}MB.`;
      }
      return null;
    },
    [accept, maxSizeMb]
  );

  const takeFile = useCallback(
    (next: File | null | undefined) => {
      if (!next) return;
      const validationError = validate(next);
      if (validationError) {
        setError(validationError);
        setFile(null);
        return;
      }
      setError(null);
      setFile(next);
      options?.onFile?.(next);
    },
    [options, validate]
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragging(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    takeFile(dropped);
  };

  return {
    isDragging,
    error,
    file,
    bind: { onDragEnter, onDragOver, onDragLeave, onDrop },
    openFilePicker: () => inputRef.current?.click(),
    inputProps: {
      ref: inputRef,
      type: "file",
      accept: ".pdf,.docx,application/pdf",
      className: "sr-only",
      onChange: (e) => takeFile(e.target.files?.[0]),
    },
    clear: () => {
      setFile(null);
      setError(null);
      if (inputRef.current) inputRef.current.value = "";
    },
  };
}
