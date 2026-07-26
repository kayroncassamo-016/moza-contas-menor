
// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import mozaLogo from "@/components/images/moza.png";
// import { PlanoFileProvider } from "@/lib/PlanoFileContext";
// import ContasMenorModule from "@/components/ContasMenorModule";
// import AssinantesModule from "@/components/AssinantesModule";

// type ModuleKey = "contasMenor" | "assinantes";

// const MODULES: { key: ModuleKey; label: string }[] = [
//   { key: "contasMenor", label: "Contas Menor" },
//   { key: "assinantes", label: "Clientes sem assinantes" },
// ];

// export default function Home() {
//   const [activeModule, setActiveModule] = useState<ModuleKey>("contasMenor");

//   return (
//     <PlanoFileProvider>
//       <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
//         <header className="mb-8 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <Image src={mozaLogo} alt="mozabanco" width={36} height={36} />
//           </div>
//           <span className="rounded-full border border-moza-line bg-white px-3 py-1 text-xs font-medium text-moza-slate">
//             DCC · Automações
//           </span>
//         </header>

//         <nav className="mb-10 flex gap-2 rounded-full border border-moza-line bg-white p-1 shadow-card w-fit">
//           {MODULES.map((m) => (
//             <button
//               key={m.key}
//               type="button"
//               onClick={() => setActiveModule(m.key)}
//               className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
//                 activeModule === m.key
//                   ? "bg-moza-red text-white"
//                   : "text-moza-slate hover:bg-moza-redSoft hover:text-moza-red"
//               }`}
//             >
//               {m.label}
//             </button>
//           ))}
//         </nav>

//         {activeModule === "contasMenor" ? <ContasMenorModule /> : <AssinantesModule />}

//         <footer className="mt-14 border-t border-moza-line pt-6 text-center text-xs text-moza-slate">
//           Todo o processamento acontece localmente no seu navegador — nenhum dado é enviado para um servidor.
//         </footer>
//       </main>
//     </PlanoFileProvider>
//   );
// }


"use client";

import { useState } from "react";
import Image from "next/image";
import mozaLogo from "@/components/images/moza.png";
import { PlanoFileProvider } from "@/lib/PlanoFileContext";
import ContasMenorModule from "@/components/ContasMenorModule";
import AssinantesModule from "@/components/AssinantesModule";
import UssdModule from "@/components/UssdModule";

type ModuleKey = "contasMenor" | "assinantes" | "ussd";

const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "contasMenor", label: "Contas Menor" },
  { key: "assinantes", label: "Clientes sem assinantes" },
  { key: "ussd", label: "USSD Moza Já" },
];

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("contasMenor");

  return (
    <PlanoFileProvider>
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src={mozaLogo} alt="mozabanco" width={36} height={36} />
          </div>
          <span className="rounded-full border border-moza-line bg-white px-3 py-1 text-xs font-medium text-moza-slate">
            DCC · Automações
          </span>
        </header>

        <nav className="mb-10 flex gap-2 rounded-full border border-moza-line bg-white p-1 shadow-card w-fit">
          {MODULES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setActiveModule(m.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeModule === m.key
                  ? "bg-moza-red text-white"
                  : "text-moza-slate hover:bg-moza-redSoft hover:text-moza-red"
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>

        {activeModule === "contasMenor" && <ContasMenorModule />}
        {activeModule === "assinantes" && <AssinantesModule />}
        {activeModule === "ussd" && <UssdModule />}

        <footer className="mt-14 border-t border-moza-line pt-6 text-center text-xs text-moza-slate">
          Todo o processamento acontece localmente no seu navegador — nenhum dado é enviado para um servidor.
        </footer>
      </main>
    </PlanoFileProvider>
  );
}


