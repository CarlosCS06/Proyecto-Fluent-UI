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

const API_URL = 'http://localhost:5037/api';

export default function PizzasPage() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const [pizzas, setPizzas] = useState(null);
  
  // Dialog State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadPizzas = async () => {
    try {
      const response = await axios.get(`${API_URL}/pizzas`);
      setPizzas(response.data);
    } catch (error) {
      console.error("Error fetching pizzas:", error);
      setPizzas([]);
    }
  };

  useEffect(() => {
    loadPizzas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPizzaClick = () => {
    setSelectedPizza(null);
    setIsEditMode(false);
    setIsPanelOpen(true);
  };

  const handleEditPizzaClick = (pizza) => {
    setSelectedPizza(pizza);
    setIsEditMode(true);
    setIsPanelOpen(true);
  };

  const handleSavePizza = async (formData) => {
    const actionName = isEditMode ? "editada" : "creada";
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/pizzas/${selectedPizza.id}`, { ...selectedPizza, name: formData.name });
      } else {
        await axios.post(`${API_URL}/pizzas`, { name: formData.name });
      }
      
      setIsPanelOpen(false);
      dispatchToast(
        <Toast>
          <ToastBody><b>¡Éxito!</b> Pizza {formData.name} {actionName} correctamente.</ToastBody>
        </Toast>,
        { intent: "success" }
      );
      loadPizzas();
    } catch (error) {
      console.error("Error saving pizza", error);
      dispatchToast(
        <Toast>
          <ToastBody><b>Error</b> Hubo un problema al guardar la pizza.</ToastBody>
        </Toast>,
        { intent: "error" }
      );
    }
  };

  const handleDeletePizza = async (pizza) => {
    if(window.confirm(`Are you sure you want to delete ${pizza.name}?`)) {
        try {
            await axios.delete(`${API_URL}/pizzas/${pizza.id}`);
            dispatchToast(
              <Toast>
                <ToastBody><b>Pizza Eliminada</b> Se ha eliminado {pizza.name} exitosamente.</ToastBody>
              </Toast>,
              { intent: "success" }
            );
            loadPizzas();
        } catch (error) {
            console.error("Error deleting pizza", error);
            dispatchToast(
              <Toast>
                <ToastBody><b>Error</b> Hubo un problema al eliminar la pizza.</ToastBody>
              </Toast>,
              { intent: "error" }
            );
        }
    }
  };

  if (!pizzas) {
    return <Spinner label="Loading pizzas..." />;
  }

  return (
    <>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Home16Regular style={{ marginRight: '4px' }} />
        <span>Home</span>
        <span style={{ color: 'gray' }}>/</span>
        <span style={{ fontWeight: 'bold' }}>Pizzas</span>
      </div>

      <div style={{ borderTop: '1px solid lightgrey', marginBottom: '3rem', marginTop: '1.5rem' }}>
        <Toolbar style={{ marginTop: 0, paddingTop: 0 }}>
          <Button 
            appearance="accent" 
            icon={<Add12Regular />} 
            onClick={handleAddPizzaClick}
            title="Add a pizza"
          >
            Añadir Nueva Pizza
          </Button>
        </Toolbar>
      </div>

      <Table aria-label="Pizzas table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Sauce</TableHeaderCell>
            <TableHeaderCell>Toppings</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell>Modified</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pizzas.map((pizza) => (
            <TableRow key={pizza.id}>
              <TableCell>
                <span 
                  style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => handleEditPizzaClick(pizza)}
                >
                  {pizza.name}
                </span>
              </TableCell>
              <TableCell>{pizza.sauce?.name}</TableCell>
              <TableCell>{pizza.toppings?.map(t => t.name).join(', ')}</TableCell>
              <TableCell>{new Date(pizza.created).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(pizza.modified).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button 
                  appearance="subtle" 
                  icon={<Delete20Regular style={{ color: 'red' }} />} 
                  onClick={() => handleDeletePizza(pizza)}
                  title="Delete pizza"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <PizzaUpsertPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        pizza={selectedPizza} 
        onSave={handleSavePizza} 
      />

      <Toaster toasterId={toasterId} />
    </>
  );
}
