
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Eye, EyeOff, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        const userRole = email.toLowerCase().includes("admin") ? "admin" : 
                          email.toLowerCase().includes("evaluador") ? "evaluator" : "assistant";
        
        let redirectPath = "/";
        switch(userRole) {
          case "admin":
            redirectPath = "/admin";
            break;
          case "evaluator":
            redirectPath = "/evaluator";
            break;
          case "assistant":
            redirectPath = "/assistant";
            break;
        }
        
        navigate(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "Error de inicio de sesión",
          description: "Usuario o contraseña incorrectos.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Ocurrió un error al iniciar sesión. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lerm-50 to-lerm-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute top-2 right-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <QrCode size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="text-center p-4">
                <h2 className="text-xl font-bold mb-4">Acceso a Formularios</h2>
                <p className="mb-4">Escanea este código QR para acceder a los formularios de pruebas físicas.</p>
                <div className="mx-auto w-48 h-48 bg-gray-200 border flex items-center justify-center">
                  <span className="text-sm text-gray-500">QR Code Placeholder</span>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open("/public-form/1", "_blank")}
                  >
                    Acceder directamente
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-lg border-t-4 border-t-lerm-500">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-lerm-700">LERM</CardTitle>
            <p className="text-gray-500 text-sm">Laboratorio de Evaluación y Rehabilitación Musculoesquelética</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-lerm-600 hover:bg-lerm-700" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⊚</span> Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión
                  </span>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Credenciales de prueba:</p>
                <p><strong>Administrador:</strong> Admin@cecar.edu.co / Admin20202025</p>
                <p><strong>Evaluador:</strong> Evaluador@cecar.edu.co / Evaluador2025</p>
                <p><strong>Asistente:</strong> Asistente@cecar.edu.co / Asistente2025</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
