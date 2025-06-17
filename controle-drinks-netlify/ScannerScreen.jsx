import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Keyboard, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ScannerScreen = ({ onGuestScanned }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [scannerActive, setScannerActive] = useState(true);
  const [validationError, setValidationError] = useState('');
  const { logout, user } = useAuth();
  const videoRef = useRef(null);

  // Função para validar o formato do código
  const validateCode = (code) => {
    // Código deve ter exatamente 6 caracteres, apenas letras e números maiúsculos
    const codeRegex = /^[A-Z0-9]{6}$/;
    return codeRegex.test(code);
  };

  const handleScan = (result) => {
    if (result) {
      const qrCode = result.text || result;
      if (qrCode && qrCode.trim()) {
        const cleanCode = qrCode.trim().toUpperCase();
        if (validateCode(cleanCode)) {
          setError('');
          setValidationError('');
          onGuestScanned(cleanCode);
        } else {
          setValidationError('Código inválido. O código deve ter exatamente 6 caracteres (letras e números maiúsculos).');
        }
      }
    }
  };

  const handleError = (err) => {
    console.error('Erro no scanner:', err);
    setError('Erro ao acessar a câmera. Tente usar a inserção manual.');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      const cleanCode = manualCode.trim().toUpperCase();
      if (validateCode(cleanCode)) {
        setValidationError('');
        onGuestScanned(cleanCode);
      } else {
        setValidationError('Código inválido. O código deve ter exatamente 6 caracteres (letras e números maiúsculos).');
      }
    }
  };

  const handleManualCodeChange = (e) => {
    // Converter para maiúsculas e limitar a 6 caracteres
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setManualCode(value);
    setValidationError('');
  };

  const toggleScanner = () => {
    setScannerActive(!scannerActive);
    setError('');
    setValidationError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Scanner QR</h1>
            <p className="text-sm text-gray-600">Olá, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={logout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Scanner Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Escaneamento de QR Code
            </CardTitle>
            <CardDescription>
              Aponte a câmera para o QR code do convidado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {validationError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            
            {scannerActive && (
              <div className="relative mb-4" style={{ backgroundColor: 'transparent' }}>
                <QrReader
                  onResult={handleScan}
                  onError={handleError}
                  videoContainerStyle={{
                    paddingTop: '100%', // Mantém a proporção 1:1
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                  videoStyle={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  constraints={{
                    facingMode: 'environment' // Usar câmera traseira
                  }}
                  ViewFinder={() => (
                    <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                          Posicione o QR code aqui
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={toggleScanner}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                {scannerActive ? 'Pausar Scanner' : 'Ativar Scanner'}
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => setShowManualInput(!showManualInput)}
                className="w-full"
              >
                <Keyboard className="mr-2 h-4 w-4" />
                Inserir código manualmente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Input Card */}
        {showManualInput && (
          <Card>
            <CardHeader>
              <CardTitle>Inserção Manual</CardTitle>
              <CardDescription>
                Digite o código do convidado (6 caracteres: letras e números maiúsculos)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-code">Código do Convidado</Label>
                  <Input
                    id="manual-code"
                    type="text"
                    placeholder="Ex: ABC123"
                    value={manualCode}
                    onChange={handleManualCodeChange}
                    maxLength={6}
                    className="uppercase"
                  />
                  <p className="text-xs text-gray-500">
                    Formato: 6 caracteres (A-Z, 0-9) - Ex: ABC123, XYZ789
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={manualCode.length !== 6}
                >
                  Buscar Convidado
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Test Codes */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Códigos de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onGuestScanned('ABC123')}
              className="w-full justify-start text-xs"
            >
              ABC123 - João Silva (3 drinks)
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onGuestScanned('XYZ789')}
              className="w-full justify-start text-xs"
            >
              XYZ789 - Maria Santos (2 drinks)
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onGuestScanned('DEF456')}
              className="w-full justify-start text-xs"
            >
              DEF456 - Convidado (4 drinks)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScannerScreen;

