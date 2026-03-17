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

export default function OtherFoodsPage() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const [foods, setFoods] = useState(null);
  
  // Dialog State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadFoods = async () => {
    try {
      const response = await axios.get(`${API_URL}/otherfoods`);
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching other foods:", error);
      setFoods([]);
    }
  };

  useEffect(() => {
    loadFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFoodClick = () => {
    setSelectedFood(null);
    setIsEditMode(false);
    setIsPanelOpen(true);
  };

  const handleEditFoodClick = (food) => {
    setSelectedFood(food);
    setIsEditMode(true);
    setIsPanelOpen(true);
  };

  const handleSaveFood = async (formData) => {
    const actionName = isEditMode ? "editada" : "creada";
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/otherfoods/${selectedFood.id}`, { id: selectedFood.id, name: formData.name });
      } else {
        await axios.post(`${API_URL}/otherfoods`, { name: formData.name });
      }
      
      setIsPanelOpen(false);
      dispatchToast(
        <Toast>
          <ToastBody><b>¡Éxito!</b> Comida {formData.name} {actionName} correctamente.</ToastBody>
        </Toast>,
        { intent: "success" }
      );
      loadFoods();
    } catch (error) {
      console.error("Error saving food", error);
      dispatchToast(
        <Toast>
          <ToastBody><b>Error</b> Hubo un problema al guardar la comida.</ToastBody>
        </Toast>,
        { intent: "error" }
      );
    }
  };

  const handleDeleteFood = async (food) => {
    if(window.confirm(`Are you sure you want to delete ${food.name}?`)) {
        try {
            await axios.delete(`${API_URL}/otherfoods/${food.id}`);
            dispatchToast(
              <Toast>
                <ToastBody><b>Comida Eliminada</b> Se ha eliminado {food.name} exitosamente.</ToastBody>
              </Toast>,
              { intent: "success" }
            );
            loadFoods();
        } catch (error) {
            console.error("Error deleting food", error);
            dispatchToast(
              <Toast>
                <ToastBody><b>Error</b> No se pudo eliminar la comida porque está siendo usada o ocurrió un error.</ToastBody>
              </Toast>,
              { intent: "error" }
            );
        }
    }
  };

  if (!foods) {
    return <Spinner label="Loading other foods..." />;
  }

  return (
    <>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Home16Regular style={{ marginRight: '4px' }} />
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <span style={{ color: 'gray' }}>/</span>
        <span style={{ fontWeight: 'bold' }}>Other Foods</span>
      </div>

      <div style={{ borderTop: '1px solid lightgrey', marginBottom: '3rem', marginTop: '1.5rem' }}>
        <Toolbar style={{ marginTop: 0, paddingTop: 0 }}>
          <Button 
            appearance="accent" 
            icon={<Add12Regular />} 
            onClick={handleAddFoodClick}
            title="Add other food"
          >
            Añadir Otra Comida
          </Button>
        </Toolbar>
      </div>

      <Table aria-label="Other foods table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell>
                <span 
                  style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => handleEditFoodClick(food)}
                >
                  {food.name}
                </span>
              </TableCell>
              <TableCell>
                <Button 
                  appearance="subtle" 
                  icon={<Delete20Regular style={{ color: 'red' }} />} 
                  onClick={() => handleDeleteFood(food)}
                  title="Delete food"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <PizzaUpsertPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        pizza={selectedFood} 
        onSave={handleSaveFood} 
      />

      <Toaster toasterId={toasterId} />
    </>
  );
}
