import { useEffect, useState } from 'react';
import { 
  Button, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Toaster,
  Spinner,
  Toolbar,
  useToastController,
  useId,
  Toast,
  ToastBody
} from '@fluentui/react-components';
import { Add12Regular, Delete20Regular, Home16Regular } from '@fluentui/react-icons';
import axios from 'axios';
import { PizzaUpsertPanel } from '../components/PizzaUpsertPanel';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5037/api';

export default function ToppingsPage() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const [toppings, setToppings] = useState(null);
  
  // Dialog State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadToppings = async () => {
    try {
      const response = await axios.get(`${API_URL}/toppings`);
      setToppings(response.data);
    } catch (error) {
      console.error("Error fetching toppings:", error);
      setToppings([]);
    }
  };

  useEffect(() => {
    loadToppings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToppingClick = () => {
    setSelectedTopping(null);
    setIsEditMode(false);
    setIsPanelOpen(true);
  };

  const handleEditToppingClick = (topping) => {
    setSelectedTopping(topping);
    setIsEditMode(true);
    setIsPanelOpen(true);
  };

  const handleSaveTopping = async (formData) => {
    const actionName = isEditMode ? "editado" : "creado";
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/toppings/${selectedTopping.id}`, { id: selectedTopping.id, name: formData.name });
      } else {
        await axios.post(`${API_URL}/toppings`, { name: formData.name });
      }
      
      setIsPanelOpen(false);
      dispatchToast(
        <Toast>
          <ToastBody><b>¡Éxito!</b> Topping {formData.name} {actionName} correctamente.</ToastBody>
        </Toast>,
        { intent: "success" }
      );
      loadToppings();
    } catch (error) {
      console.error("Error saving topping", error);
      dispatchToast(
        <Toast>
          <ToastBody><b>Error</b> Hubo un problema al guardar el topping.</ToastBody>
        </Toast>,
        { intent: "error" }
      );
    }
  };

  const handleDeleteTopping = async (topping) => {
    if(window.confirm(`Are you sure you want to delete ${topping.name}?`)) {
        try {
            await axios.delete(`${API_URL}/toppings/${topping.id}`);
            dispatchToast(
              <Toast>
                <ToastBody><b>Topping Eliminado</b> Se ha eliminado {topping.name} exitosamente.</ToastBody>
              </Toast>,
              { intent: "success" }
            );
            loadToppings();
        } catch (error) {
            console.error("Error deleting topping", error);
            dispatchToast(
              <Toast>
                <ToastBody><b>Error</b> No se pudo eliminar el topping porque está siendo usado o ocurrió un error.</ToastBody>
              </Toast>,
              { intent: "error" }
            );
        }
    }
  };

  if (!toppings) {
    return <Spinner label="Loading toppings..." />;
  }

  return (
    <>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Home16Regular style={{ marginRight: '4px' }} />
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <span style={{ color: 'gray' }}>/</span>
        <span style={{ fontWeight: 'bold' }}>Toppings</span>
      </div>

      <div style={{ borderTop: '1px solid lightgrey', marginBottom: '3rem', marginTop: '1.5rem' }}>
        <Toolbar style={{ marginTop: 0, paddingTop: 0 }}>
          <Button 
            appearance="accent" 
            icon={<Add12Regular />} 
            onClick={handleAddToppingClick}
            title="Add a topping"
          >
            Añadir Nuevo Topping
          </Button>
        </Toolbar>
      </div>

      <Table aria-label="Toppings table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {toppings.map((topping) => (
            <TableRow key={topping.id}>
              <TableCell>
                <span 
                  style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => handleEditToppingClick(topping)}
                >
                  {topping.name}
                </span>
              </TableCell>
              <TableCell>
                <Button 
                  appearance="subtle" 
                  icon={<Delete20Regular style={{ color: 'red' }} />} 
                  onClick={() => handleDeleteTopping(topping)}
                  title="Delete topping"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <PizzaUpsertPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        pizza={selectedTopping} 
        onSave={handleSaveTopping} 
      />

      <Toaster toasterId={toasterId} />
    </>
  );
}
