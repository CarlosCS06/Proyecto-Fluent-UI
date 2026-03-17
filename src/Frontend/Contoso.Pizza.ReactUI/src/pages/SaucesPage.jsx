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

export default function SaucesPage() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const [sauces, setSauces] = useState(null);
  
  // Dialog State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const loadSauces = async () => {
    try {
      const response = await axios.get(`${API_URL}/sauces`);
      setSauces(response.data);
    } catch (error) {
      console.error("Error fetching sauces:", error);
      setSauces([]);
    }
  };

  useEffect(() => {
    loadSauces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSauceClick = () => {
    setSelectedSauce(null);
    setIsEditMode(false);
    setIsPanelOpen(true);
  };

  const handleEditSauceClick = (sauce) => {
    setSelectedSauce(sauce);
    setIsEditMode(true);
    setIsPanelOpen(true);
  };

  const handleSaveSauce = async (formData) => {
    // We'll reuse PizzaUpsertPanel for now with "Name" field
    const actionName = isEditMode ? "editada" : "creada";
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/sauces/${selectedSauce.id}`, { id: selectedSauce.id, name: formData.name });
      } else {
        await axios.post(`${API_URL}/sauces`, { name: formData.name });
      }
      
      setIsPanelOpen(false);
      dispatchToast(
        <Toast>
          <ToastBody><b>¡Éxito!</b> Salsa {formData.name} {actionName} correctamente.</ToastBody>
        </Toast>,
        { intent: "success" }
      );
      loadSauces();
    } catch (error) {
      console.error("Error saving sauce", error);
      dispatchToast(
        <Toast>
          <ToastBody><b>Error</b> Hubo un problema al guardar la salsa.</ToastBody>
        </Toast>,
        { intent: "error" }
      );
    }
  };

  const handleDeleteSauce = async (sauce) => {
    if(window.confirm(`Are you sure you want to delete ${sauce.name}?`)) {
        try {
            await axios.delete(`${API_URL}/sauces/${sauce.id}`);
            dispatchToast(
              <Toast>
                <ToastBody><b>Salsa Eliminada</b> Se ha eliminado {sauce.name} exitosamente.</ToastBody>
              </Toast>,
              { intent: "success" }
            );
            loadSauces();
        } catch (error) {
            console.error("Error deleting sauce", error);
            dispatchToast(
              <Toast>
                <ToastBody><b>Error</b> No se pudo eliminar la salsa porque está siendo usada o ocurrió un error.</ToastBody>
              </Toast>,
              { intent: "error" }
            );
        }
    }
  };

  if (!sauces) {
    return <Spinner label="Loading sauces..." />;
  }

  return (
    <>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Home16Regular style={{ marginRight: '4px' }} />
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <span style={{ color: 'gray' }}>/</span>
        <span style={{ fontWeight: 'bold' }}>Sauces</span>
      </div>

      <div style={{ borderTop: '1px solid lightgrey', marginBottom: '3rem', marginTop: '1.5rem' }}>
        <Toolbar style={{ marginTop: 0, paddingTop: 0 }}>
          <Button 
            appearance="accent" 
            icon={<Add12Regular />} 
            onClick={handleAddSauceClick}
            title="Add a sauce"
          >
            Añadir Nueva Salsa
          </Button>
        </Toolbar>
      </div>

      <Table aria-label="Sauces table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sauces.map((sauce) => (
            <TableRow key={sauce.id}>
              <TableCell>
                <span 
                  style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => handleEditSauceClick(sauce)}
                >
                  {sauce.name}
                </span>
              </TableCell>
              <TableCell>
                <Button 
                  appearance="subtle" 
                  icon={<Delete20Regular style={{ color: 'red' }} />} 
                  onClick={() => handleDeleteSauce(sauce)}
                  title="Delete sauce"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <PizzaUpsertPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        pizza={selectedSauce} 
        onSave={handleSaveSauce} 
      />

      <Toaster toasterId={toasterId} />
    </>
  );
}
