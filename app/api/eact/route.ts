

// import { NextRequest, NextResponse } from "next/server";
// import ExcelJS from "exceljs";
// import { writeFile, unlink } from "fs/promises";
// import { tmpdir } from "os";
// import path from "path";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// function normalize(v: unknown): string {
//   if (v === null || v === undefined) return "";
//   return String(v).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
// }
// function normVal(v: unknown): string {
//   return String(v ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
// }

// export async function POST(req: NextRequest) {
//   let tmpPath: string | null = null;
//   try {
//     const form = await req.formData();
//     const file = form.get("file") as File | null;
//     if (!file) return NextResponse.json({ error: "Ficheiro em falta." }, { status: 400 });

//     tmpPath = path.join(tmpdir(), `eact-${Date.now()}.xlsx`);
//     const bytes = new Uint8Array(await file.arrayBuffer());
//     await writeFile(tmpPath, bytes);

//     const wb = new ExcelJS.stream.xlsx.WorkbookReader(tmpPath, {
//       entries: "emit",
//       worksheets: "emit",
//       sharedStrings: "cache",
//     });

//     let cSit = -1, cContrato = -1, cEntSolta = -1, cEntAssoc = -1;
//     let totalBruto = 0;
//     const vistosEnc = new Set<unknown>();
//     let encerradas = 0;
//     const vistosSolta = new Set<unknown>();
//     let entidadesSoltas = 0;

//     for await (const worksheetReader of wb) {
//       const sheetName = (worksheetReader as unknown as { name?: string }).name ?? "";
//       if (!normalize(sheetName).includes("export")) continue;

//       for await (const row of worksheetReader) {
//         const vals = row.values as unknown[];
//         if (row.number === 1) {
//           const header = vals.map(normalize);
//           cSit = header.indexOf(normalize("DSC_SIT"));
//           cContrato = header.indexOf(normalize("COD_CONTRATO"));
//           cEntSolta = header.indexOf(normalize("ENTIDADE_SOLTA"));
//           cEntAssoc = header.indexOf(normalize("ENTIDADE_ASSOCIADA"));
//           continue;
//         }
//         if (vals.every((v) => v === undefined || v === null)) continue;
//         totalBruto++;
//         if (normVal(vals[cSit]) === "ENCERRADA") {
//           const k = vals[cContrato];
//           if (!vistosEnc.has(k)) { vistosEnc.add(k); encerradas++; }
//         }
//         if (normVal(vals[cEntSolta]) === "SIM") {
//           const k = vals[cEntAssoc];
//           if (!vistosSolta.has(k)) { vistosSolta.add(k); entidadesSoltas++; }
//         }
//       }
//     }

//     return NextResponse.json({ totalBruto, encerradas, entidadesSoltas });
//   } catch (e) {
//     console.error("Erro /api/eact:", e);
//     return NextResponse.json(
//       { error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) },
//       { status: 500 }
//     );
//   } finally {
//     if (tmpPath) await unlink(tmpPath).catch(() => {});
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import ExcelJS from "exceljs";
// import { writeFile, unlink } from "fs/promises";
// import { tmpdir } from "os";
// import path from "path";

// export const runtime = "nodejs";
// export const maxDuration = 300;

// function normalize(v: unknown): string {
//   if (v === null || v === undefined) return "";

//   return String(v)
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .trim();
// }

// function normVal(v: unknown): string {
//   return String(v ?? "")
//     .replace(/\u00a0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toUpperCase();
// }

// export async function POST(req: NextRequest) {
//   let tmpPath: string | null = null;

//   try {
//     console.log("[EACT] Início do processamento");

//     const form = await req.formData();

//     const file = form.get("file");

//     if (!(file instanceof File)) {
//       console.error("[EACT] Ficheiro não encontrado no FormData");

//       return NextResponse.json(
//         { error: "Ficheiro em falta." },
//         { status: 400 }
//       );
//     }

//     console.log(
//       `[EACT] Ficheiro recebido: ${file.name} (${file.size} bytes)`
//     );

//     if (file.size === 0) {
//       return NextResponse.json(
//         { error: "O ficheiro EACT está vazio." },
//         { status: 400 }
//       );
//     }

//     tmpPath = path.join(
//       tmpdir(),
//       `eact-${Date.now()}-${Math.random().toString(36).slice(2)}.xlsx`
//     );

//     console.log(`[EACT] A guardar temporariamente em: ${tmpPath}`);

//     const bytes = new Uint8Array(await file.arrayBuffer());

//     await writeFile(tmpPath, bytes);

//     console.log("[EACT] Ficheiro guardado");

//     const wb = new ExcelJS.stream.xlsx.WorkbookReader(tmpPath, {
//       entries: "emit",
//       worksheets: "emit",
//       sharedStrings: "cache",
//       hyperlinks: "ignore",
//       styles: "ignore",
//     });

//     let cSit = -1;
//     let cContrato = -1;
//     let cEntSolta = -1;
//     let cEntAssoc = -1;

//     let totalBruto = 0;

//     const vistosEnc = new Set<string>();
//     let encerradas = 0;

//     const vistosSolta = new Set<string>();
//     let entidadesSoltas = 0;

//     let encontrouExport = false;
//     let encontrouHeader = false;

//     for await (const worksheetReader of wb) {
//       const sheetName =
//         (worksheetReader as unknown as { name?: string }).name ?? "";

//       console.log(`[EACT] Sheet encontrada: ${sheetName}`);

//       if (!normalize(sheetName).includes("export")) {
//         continue;
//       }

//       encontrouExport = true;

//       for await (const row of worksheetReader) {
//         /*
//          * IMPORTANTE:
//          * ExcelJS usa row.values com índice 1 para a primeira
//          * coluna. O índice 0 normalmente fica vazio.
//          */
//         const vals = Array.isArray(row.values)
//           ? (row.values as unknown[])
//           : [];

//         if (row.number === 1) {
//           const header = vals.map(normalize);

//           console.log("[EACT] Cabeçalho:", header);

//           cSit = header.indexOf(normalize("DSC_SIT"));
//           cContrato = header.indexOf(normalize("COD_CONTRATO"));
//           cEntSolta = header.indexOf(normalize("ENTIDADE_SOLTA"));
//           cEntAssoc = header.indexOf(normalize("ENTIDADE_ASSOCIADA"));

//           encontrouHeader = true;

//           console.log("[EACT] Índices encontrados:", {
//             cSit,
//             cContrato,
//             cEntSolta,
//             cEntAssoc,
//           });

//           if (
//             cSit === -1 ||
//             cContrato === -1 ||
//             cEntSolta === -1 ||
//             cEntAssoc === -1
//           ) {
//             return NextResponse.json(
//               {
//                 error:
//                   "O ficheiro EACT foi lido, mas não encontrei todas as colunas esperadas.",
//                 detalhes: {
//                   DSC_SIT: cSit,
//                   COD_CONTRATO: cContrato,
//                   ENTIDADE_SOLTA: cEntSolta,
//                   ENTIDADE_ASSOCIADA: cEntAssoc,
//                 },
//               },
//               { status: 422 }
//             );
//           }

//           continue;
//         }

//         if (
//           vals.length === 0 ||
//           vals.every((v) => v === undefined || v === null || v === "")
//         ) {
//           continue;
//         }

//         totalBruto++;

//         const situacao = normVal(vals[cSit]);
//         const contrato = normVal(vals[cContrato]);

//         if (situacao === "ENCERRADA" && contrato) {
//           if (!vistosEnc.has(contrato)) {
//             vistosEnc.add(contrato);
//             encerradas++;
//           }
//         }

//         const entidadeSolta = normVal(vals[cEntSolta]);
//         const entidadeAssociada = normVal(vals[cEntAssoc]);

//         if (entidadeSolta === "SIM" && entidadeAssociada) {
//           if (!vistosSolta.has(entidadeAssociada)) {
//             vistosSolta.add(entidadeAssociada);
//             entidadesSoltas++;
//           }
//         }

//         /*
//          * Log de progresso para ficheiros muito grandes.
//          */
//         if (totalBruto % 10000 === 0) {
//           console.log(
//             `[EACT] Processadas ${totalBruto} linhas | ` +
//               `Encerradas: ${encerradas} | ` +
//               `Entidades soltas: ${entidadesSoltas}`
//           );
//         }
//       }
//     }

//     if (!encontrouExport) {
//       return NextResponse.json(
//         {
//           error:
//             "Não encontrei nenhuma folha cujo nome contenha 'Export'.",
//         },
//         { status: 422 }
//       );
//     }

//     if (!encontrouHeader) {
//       return NextResponse.json(
//         {
//           error:
//             "Encontrei a folha Export, mas não consegui encontrar o cabeçalho.",
//         },
//         { status: 422 }
//       );
//     }

//     console.log("[EACT] Processamento concluído:", {
//       totalBruto,
//       encerradas,
//       entidadesSoltas,
//     });

//     return NextResponse.json({
//       totalBruto,
//       encerradas,
//       entidadesSoltas,
//     });
//   } catch (e) {
//     console.error("[EACT] ERRO COMPLETO:", e);

//     const message =
//       e instanceof Error
//         ? `${e.name}: ${e.message}`
//         : String(e);

//     return NextResponse.json(
//       {
//         error: "Erro ao processar o ficheiro EACT.",
//         detalhes: message,
//       },
//       { status: 500 }
//     );
//   } finally {
//     if (tmpPath) {
//       await unlink(tmpPath).catch((err) => {
//         console.warn("[EACT] Não foi possível remover temporário:", err);
//       });
//     }

//     console.log("[EACT] Fim da requisição");
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300;

function normalize(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function normVal(v: unknown): string {
  return String(v ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
}

export async function POST(req: NextRequest) {
  let tmpPath: string | null = null;
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Ficheiro em falta." }, { status: 400 });

    tmpPath = path.join(tmpdir(), `eact-${Date.now()}.xlsx`);
    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(tmpPath, bytes);

    const wb = new ExcelJS.stream.xlsx.WorkbookReader(tmpPath, {
      entries: "emit",
      worksheets: "emit",
      sharedStrings: "cache",
    });

    let cSit = -1, cContrato = -1, cEntSolta = -1, cEntAssoc = -1;
    let totalBruto = 0;
    const vistosEnc = new Set<unknown>();
    let encerradas = 0;
    const vistosSolta = new Set<unknown>();
    let entidadesSoltas = 0;
    let consecutiveEmpty = 0;

    for await (const worksheetReader of wb) {
      const sheetName = (worksheetReader as unknown as { name?: string }).name ?? "";
      if (!normalize(sheetName).includes("export")) continue;

      for await (const row of worksheetReader) {
        const vals = row.values as unknown[];
        if (row.number === 1) {
          const header = vals.map(normalize);
          cSit = header.indexOf(normalize("DSC_SIT"));
          cContrato = header.indexOf(normalize("COD_CONTRATO"));
          cEntSolta = header.indexOf(normalize("ENTIDADE_SOLTA"));
          cEntAssoc = header.indexOf(normalize("ENTIDADE_ASSOCIADA"));
          continue;
        }
        if (vals.every((v) => v === undefined || v === null)) {
          consecutiveEmpty++;
          // O ficheiro declara 1.048.576 linhas mas só tem dados reais nas
          // primeiras centenas de milhares — corta ao fim de 2000 linhas
          // vazias seguidas em vez de percorrer o resto à toa.
          if (consecutiveEmpty > 2000) break;
          continue;
        }
        consecutiveEmpty = 0;
        totalBruto++;
        if (normVal(vals[cSit]) === "ENCERRADA") {
          const k = vals[cContrato];
          if (!vistosEnc.has(k)) { vistosEnc.add(k); encerradas++; }
        }
        if (normVal(vals[cEntSolta]) === "SIM") {
          const k = vals[cEntAssoc];
          if (!vistosSolta.has(k)) { vistosSolta.add(k); entidadesSoltas++; }
        }
      }
    }

    return NextResponse.json({ totalBruto, encerradas, entidadesSoltas });
  } catch (e) {
    console.error("Erro /api/eact:", e);
    return NextResponse.json(
      { error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) },
      { status: 500 }
    );
  } finally {
    if (tmpPath) await unlink(tmpPath).catch(() => {});
  }
}
