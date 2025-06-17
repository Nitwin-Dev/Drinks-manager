import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, User, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

// Dados mockados para demonstração com novos códigos de 6 caracteres
const mockGuests = {
  'ABC123': {
    id: 1,
    qr_code: 'ABC123',
    name: 'João Silva',
    total_drinks_allowed: 3,
    drinks_consumed: 0,
    can_consume_more: true
  },
  'XYZ789': {
    id: 2,
    qr_code: 'XYZ789',
    name: 'Maria Santos',
    total_drinks_allowed: 2,
    drinks_consumed: 1,
    can_consume_more: true
  },
  'DEF456': {
    id: 3,
    qr_code: 'DEF456',
    name: null,
    total_drinks_allowed: 4,
    drinks_consumed: 2,
    can_consume_more: true
  }
};

const GuestScreen = ({ qrCode, onBack }) => {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGuest();
  }, [qrCode]);

  const fetchGuest = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const guestData = mockGuests[qrCode];
      if (guestData) {
        setGuest(guestData);
      } else {
        setError('Convidado não encontrado. Verifique se o código está correto.');
      }
    } catch (err) {
      console.error('Erro ao buscar convidado:', err);
      setError('Erro ao buscar informações do convidado');
    } finally {
      setLoading(false);
    }
  };

  const registerDrink = async () => {
    try {
      setRegistering(true);
      setError('');
      setSuccess('');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (guest.drinks_consumed >= guest.total_drinks_allowed) {
        setError('Limite de drinks atingido');
        return;
      }
      
      // Atualizar dados localmente
      const updatedGuest = {
        ...guest,
        drinks_consumed: guest.drinks_consumed + 1,
        can_consume_more: (guest.drinks_consumed + 1) < guest.total_drinks_allowed
      };
      
      setGuest(updatedGuest);
      // Atualizar dados mockados para persistir durante a sessão
      mockGuests[qrCode] = updatedGuest;
      
      setSuccess('Drink registrado com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erro ao registrar drink:', err);
      setError('Erro ao registrar drink');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Carregando informações...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Scanner
          </Button>
          
          <Card>
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Códigos válidos devem ter:</p>
                <ul className="text-xs text-gray-500 list-disc list-inside">
                  <li>Exatamente 6 caracteres</li>
                  <li>Apenas letras (A-Z) e números (0-9)</li>
                  <li>Todas as letras maiúsculas</li>
                  <li>Sem espaços ou caracteres especiais</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Exemplos: ABC123, XYZ789, DEF456
                </p>
              </div>
              
              <Button 
                onClick={fetchGuest}
                className="w-full mt-4"
                variant="outline"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = guest ? (guest.drinks_consumed / guest.total_drinks_allowed) * 100 : 0;
  const isLimitReached = guest && guest.drinks_consumed >= guest.total_drinks_allowed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Scanner
        </Button>

        {/* Guest Info Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              {guest?.name || `Convidado ${guest?.qr_code}`}
            </CardTitle>
            <CardDescription>
              Código: {guest?.qr_code}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drink Counter */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {guest?.drinks_consumed} / {guest?.total_drinks_allowed}
              </div>
              <p className="text-sm text-gray-600 mb-4">Drinks consumidos</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isLimitReached ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              
              {/* Status Badge */}
              <Badge 
                variant={isLimitReached ? "destructive" : "default"}
                className="mb-4"
              >
                {isLimitReached ? (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Limite Atingido
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Pode Consumir
                  </>
                )}
              </Badge>
            </div>

            {/* Messages */}
            {success && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Register Drink Button */}
            <Button 
              onClick={registerDrink}
              disabled={isLimitReached || registering}
              className={`w-full ${isLimitReached ? 'opacity-50' : ''}`}
              variant={isLimitReached ? "secondary" : "default"}
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : isLimitReached ? (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Limite Atingido
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar +1 Drink
                </>
              )}
            </Button>

            {/* Remaining drinks info */}
            {!isLimitReached && (
              <p className="text-center text-sm text-gray-600">
                Restam {guest?.total_drinks_allowed - guest?.drinks_consumed} drinks
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestScreen;

