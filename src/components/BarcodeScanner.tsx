import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Scan, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TributeData {
  codigo: string;
  produto: string;
  icms: number;
  pis: number;
  cofins: number;
  ipi: number;
  total: number;
}

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [tributeData, setTributeData] = useState<TributeData | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simula busca de tributos no banco de dados
  const fetchTributeData = (code: string): TributeData => {
    // Simulação de dados - em produção, faria uma requisição ao backend
    const icms = Math.random() * 18 + 7; // 7-25%
    const pis = Math.random() * 1.65 + 0.65; // 0.65-2.3%
    const cofins = Math.random() * 7.6 + 3; // 3-10.6%
    const ipi = Math.random() * 15; // 0-15%
    
    return {
      codigo: code,
      produto: `Produto ${code.substring(0, 8)}`,
      icms: parseFloat(icms.toFixed(2)),
      pis: parseFloat(pis.toFixed(2)),
      cofins: parseFloat(cofins.toFixed(2)),
      ipi: parseFloat(ipi.toFixed(2)),
      total: parseFloat((icms + pis + cofins + ipi).toFixed(2)),
    };
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
  const handleScannerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim();
    if (!code) return;

    setScannedCode(code);
    setIsScanning(false);
    
    // Simula busca no banco de dados
    const data = fetchTributeData(code);
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
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent gradient-primary">
            Scanner de Códigos
          </h1>
          <p className="text-muted-foreground text-lg">
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
                <p className="font-mono font-semibold text-lg">{tributeData.codigo}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Produto</p>
                <p className="font-semibold text-lg">{tributeData.produto}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Tributos</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">ICMS</span>
                    <span className="font-semibold">{tributeData.icms}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">PIS</span>
                    <span className="font-semibold">{tributeData.pis}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">COFINS</span>
                    <span className="font-semibold">{tributeData.cofins}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">IPI</span>
                    <span className="font-semibold">{tributeData.ipi}%</span>
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
