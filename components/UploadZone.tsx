"use client";

import { useCallback, useRef, useState } from "react";
import { FileSpreadsheet, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

interface SlotProps {
  title: string;
  hint: string;
  onFile: (file: File) => void;
  isLoading: boolean;
  fileName: string | null;
}

function Slot({ title, hint, onFile, isLoading, fileName }: SlotProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const isExcel = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");
      if (!isExcel) return;
      onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors duration-200 ${
        dragOver ? "border-moza-red bg-moza-redSoft" : "border-moza-line bg-white/60"
      }`}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            dragOver ? "bg-moza-red text-white" : fileName ? "bg-emerald-50 text-emerald-600" : "bg-moza-redSoft text-moza-red"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : fileName ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <div>
          <p className="font-display text-base font-semibold text-moza-ink">{title}</p>
          <p className="mt-1 text-xs text-moza-slate">
            {isLoading ? "A processar…" : fileName ? fileName : hint}
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-moza-red px-5 py-2 text-xs font-medium text-white shadow-card transition-transform hover:scale-[1.02] hover:bg-moza-redDeep active:scale-[0.98]"
        >
          {fileName ? "Trocar ficheiro" : "Escolher ficheiro"}
        </button>

        <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
    </div>
  );
}

interface Props {
  onPlanoFile: (file: File) => void;
  onContasMenorFile: (file: File) => void;
  isLoading: boolean;
  error: string | null;
  planoFileName: string | null;
  contasMenorFileName: string | null;
}

export default function UploadZone({
  onPlanoFile,
  onContasMenorFile,
  isLoading,
  error,
  planoFileName,
  contasMenorFileName,
}: Props) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Slot
          title="1. Plano de Actividades"
          hint="ficheiro .xlsx com a aba “Mapa de acompanhamento”"
          onFile={onPlanoFile}
          isLoading={isLoading}
          fileName={planoFileName}
        />
        <Slot
          title="2. Contas Menor"
          hint="ficheiro .xlsx com a lista de contas e datas de nascimento"
          onFile={onContasMenorFile}
          isLoading={isLoading}
          fileName={contasMenorFileName}
        />
      </div>
      {error && (
        <p className="mt-4 text-center text-sm font-medium text-moza-red">{error}</p>
      )}
    </div>
  );
}
