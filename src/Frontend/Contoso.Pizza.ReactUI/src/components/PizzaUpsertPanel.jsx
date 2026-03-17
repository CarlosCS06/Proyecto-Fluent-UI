import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Label,
} from "@fluentui/react-components";
import { useState, useEffect } from "react";

export const PizzaUpsertPanel = ({ isOpen, onClose, pizza, onSave }) => {
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (pizza) {
      setFormData({ name: pizza.name || "" });
    } else {
      setFormData({ name: "New Pizza" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pizza, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(e, data) => !data.open && onClose()}>
      <DialogSurface>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <DialogTitle>{pizza ? "Edit pizza" : "Add a pizza"}</DialogTitle>
            <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <Label htmlFor="pizzaName" required>Name</Label>
                <Input 
                   id="pizzaName"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   style={{ width: '100%' }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" appearance="primary">
                {pizza ? "Save changes" : "Add"}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
