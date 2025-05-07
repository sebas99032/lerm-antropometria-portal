
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { mockUsers, User } from "@/lib/mockData";
import { Plus, Trash2, User as UserIcon } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({ ...prev, role: value }));
  };

  const handleCreateUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos son obligatorios."
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El correo electrónico ya está en uso."
      });
      return;
    }

    // Create new user
    const newUserObj: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "admin" | "evaluator" | "assistant",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setUsers([...users, newUserObj]);
    setNewUser({ name: "", email: "", password: "", role: "" });
    setDialogOpen(false);
    
    toast({
      title: "Usuario creado",
      description: `El usuario ${newUser.name} ha sido creado exitosamente.`
    });
  };

  const handleDeleteUser = (userId: string) => {
    // Check if it's the admin user
    const userToDelete = users.find(user => user.id === userId);
    
    if (userToDelete && userToDelete.email.toLowerCase() === "admin@cecar.edu.co") {
      toast({
        variant: "destructive",
        title: "Acción no permitida",
        description: "El usuario administrador no puede ser eliminado."
      });
      return;
    }

    // Delete user
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Panel de Administrador" />
      
      <main className="container mx-auto py-6 px-4 flex-1">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios del sistema</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Complete el formulario para crear un nuevo usuario en el sistema.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        placeholder="Nombre completo"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        placeholder="Contraseña"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select onValueChange={handleRoleChange} value={newUser.role}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="evaluator">Evaluador</SelectItem>
                          <SelectItem value="assistant">Asistente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateUser}>Crear Usuario</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription>
                Los usuarios administradores tienen acceso completo al sistema. Los evaluadores pueden revisar formularios y asignar pruebas. Los asistentes pueden realizar pruebas antropométricas.
              </AlertDescription>
            </Alert>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'evaluator' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' :
                         user.role === 'evaluator' ? 'Evaluador' : 'Asistente'}
                      </span>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.email.toLowerCase() === "admin@cecar.edu.co"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
