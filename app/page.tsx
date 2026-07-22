"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import Dashboard from "@/components/Dashboard";
import {
  parsePlanoWorkbook,
  parseContasMenorWorkbook,
  mergeContasMenorIntoPlano,
  PlanoParseError,
  type ParsedResult,
  type ContasMenorResult,
} from "@/lib/parsePlano";
import Image from "next/image";
import mozaLogo from "@/components/images/moza.png";


export default function Home() {
  const [planoFile, setPlanoFile] = useState<File | null>(null);
  const [contasMenorFile, setContasMenorFile] = useState<File | null>(null);
  const [planoParsed, setPlanoParsed] = useState<ParsedResult | null>(null);
  const [cmParsed, setCmParsed] = useState<ContasMenorResult | null>(null);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function recombine(plano: ParsedResult | null, cm: ContasMenorResult | null) {
    if (!plano) return;
    if (!cm) {
      setResult(plano);
      return;
    }
    if (!plano.targetPeriod) {
      setError(
        "Este Plano de Actividades já não tem nenhuma semana em branco para calcular — todas as semanas visíveis já estão preenchidas."
      );
      setResult(plano);
      return;
    }
    setResult(mergeContasMenorIntoPlano(plano, cm));
  }

  async function handlePlanoFile(file: File) {
    setIsLoading(true);
    setError(null);
    setPlanoFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = parsePlanoWorkbook(buffer);
      setPlanoParsed(parsed);
      recombine(parsed, cmParsed);
    } catch (e) {
      setPlanoParsed(null);
      setResult(null);
      setError(e instanceof PlanoParseError ? e.message : "Não consegui ler o Plano de Actividades.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleContasMenorFile(file: File) {
    setIsLoading(true);
    setError(null);
    setContasMenorFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseContasMenorWorkbook(buffer);
      setCmParsed(parsed);
      recombine(planoParsed, parsed);
    } catch (e) {
      setCmParsed(null);
      setError(e instanceof PlanoParseError ? e.message : "Não consegui ler o ficheiro Contas Menor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moza-red font-display text-lg font-bold text-white">M</span>
          <span className="font-display text-lg font-semibold tracking-tight text-moza-ink">
            moza<span className="text-moza-red">banco</span>
          </span> */}
          <Image
            src={mozaLogo}
            alt="mozabanco"
            width={36}
            height={36}
          />

        </div>
        <span className="rounded-full border border-moza-line bg-white px-3 py-1 text-xs font-medium text-moza-slate">
          DCC · Contas Menor
        </span>
      </header>

      <section className="mb-10">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-moza-red">
          Contas Menor → cálculo automático
        </p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-moza-ink sm:text-4xl">
          Cálculo automático na semana que está em branco.
        </h1>
        <p className="mt-3 max-w-2xl text-moza-slate">
          Carregue os dois ficheiros. Identificamos a 1ª semana ainda por
          preencher no Plano de Actividades e calculamos os seus valores a
          partir das datas de nascimento no ficheiro Contas Menor.
        </p>
      </section>

      <section className="mb-10">
        <UploadZone
          onPlanoFile={handlePlanoFile}
          onContasMenorFile={handleContasMenorFile}
          isLoading={isLoading}
          error={error}
          planoFileName={planoFile?.name ?? null}
          contasMenorFileName={contasMenorFile?.name ?? null}
        />
      </section>

      {result && (
        <section>
          <Dashboard result={result} />
        </section>
      )}

      <footer className="mt-14 border-t border-moza-line pt-6 text-center text-xs text-moza-slate">
        Todo o processamento acontece localmente no seu navegador — nenhum dado é enviado para um servidor.
      </footer>
    </main>
  );
}
