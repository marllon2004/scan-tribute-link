import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Scan, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TributeData {
  ean: string;
  descricao: string;
  ncm: string;
  cest: string;
  cfop_venda: string;
  cst: string;
  icms: number;
  icms_pdv: number;
  red_bc_icms: number;
  nat_rec_isenta: string;
  total: number;
}

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [tributeData, setTributeData] = useState<TributeData | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTributeData = async (code: string): Promise<TributeData | null> => {
  try {
    const res = await fetch(`http://localhost:3001/produto/${code}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

  // Mantém o foco no input escondido
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus();
    };

    const handleFocus = () => {
      setIsScanning(true);
    };

    document.addEventListener("click", handleClick);
    inputRef.current?.addEventListener("focus", handleFocus);
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("click", handleClick);
      inputRef.current?.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Captura quando o scanner envia o código
  const handleScannerInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim();
    if (!code) return;

    setScannedCode(code);
    setIsScanning(false);
    
    // Simula busca no banco de dados
    const data = await fetchTributeData(code);
    setTributeData(data);
    setShowModal(true);

    // Limpa o input e refoca
    e.target.value = "";
    setTimeout(() => {
      inputRef.current?.focus();
      setIsScanning(true);
    }, 100);
  };

  const closeModal = () => {
    setShowModal(false);
    setTributeData(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Input escondido para capturar scanner */}
      <input
        ref={inputRef}
        type="text"
        onChange={handleScannerInput}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      {/* Interface visual */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="gradient-primary h-32 flex items-center justify-center rounded-2xl">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-white">
              Scanner de Códigos
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mt-5">
            Sistema de Leitura e Consulta de Tributos
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-8 md:p-12 border border-border">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className={`relative ${isScanning ? 'animate-scan-pulse' : ''}`}>
              <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                {isScanning ? (
                  <Scan className="w-16 h-16 text-primary-foreground" />
                ) : (
                  <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
                )}
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">
                {isScanning ? "Aguardando leitura..." : "Código detectado!"}
              </h2>
              <p className="text-muted-foreground">
                {isScanning 
                  ? "Aponte o leitor para o código de barras ou QR Code"
                  : `Código: ${scannedCode}`
                }
              </p>
            </div>

            {!isScanning && (
              <div className="flex gap-3 animate-fade-in">
                <Button
                  onClick={() => setShowModal(true)}
                  className="gradient-primary text-white hover:opacity-90 transition-opacity"
                >
                  Ver Detalhes
                </Button>
                <Button
                  onClick={() => {
                    setIsScanning(true);
                    inputRef.current?.focus();
                  }}
                  variant="outline"
                >
                  Novo Scan
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 Dica: Clique em qualquer lugar para manter o scanner ativo</p>
        </div>
      </div>

      {/* Modal com informações dos tributos */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Informações do Produto</DialogTitle>
          </DialogHeader>

          {tributeData && (
            <div className="space-y-6 py-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Código de Barras</p>
                <p className="font-mono font-semibold text-lg">{tributeData.ean}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Produto</p>
                <p className="font-semibold text-lg">{tributeData.descricao}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Tributos</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">NCM</span>
                    <span className="font-semibold">{tributeData.ncm}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">CEST</span>
                    <span className="font-semibold">{tributeData.cest}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">CFOP Venda</span>
                    <span className="font-semibold">{tributeData.cfop_venda}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">CST</span>
                    <span className="font-semibold">{tributeData.cst}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">% ICMS</span>
                    <span className="font-semibold">{tributeData.icms}%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">% ICMS PDV</span>
                    <span className="font-semibold">{tributeData.icms_pdv}%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">% Red. BC ICMS</span>
                    <span className="font-semibold">{tributeData.red_bc_icms}%</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Nat. Rec. Isenta Pis/Cofins</span>
                    <span className="font-semibold">{tributeData.nat_rec_isenta}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 gradient-success rounded-lg mt-4">
                  <span className="text-accent-foreground font-semibold">Total de Tributos</span>
                  <span className="text-accent-foreground font-bold text-xl">{tributeData.total}%</span>
                </div>
              </div>

              <Button 
                onClick={closeModal}
                className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
              >
                Fechar e Escanear Novo Código
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarcodeScanner;
