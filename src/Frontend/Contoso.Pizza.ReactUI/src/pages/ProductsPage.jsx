import React, { useState, useEffect } from 'react';
import {
  Title1, Button, Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell,
  TableCellLayout, Spinner, MessageBar, MessageBarTitle, Input, Label,
  makeStyles, tokens
} from '@fluentui/react-components';
import { Add24Regular, Delete24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  }
});

const ProductsPage = () => {
  const styles = useStyles();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: 0, cost: 0, stockQuantity: 0, minStockLevel: 10, category: '' });

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5037/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar productos");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:5037/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        fetchProducts();
        setNewProduct({ name: '', sku: '', price: 0, cost: 0, stockQuantity: 0, minStockLevel: 10, category: '' });
      }
    } catch (err) {
      alert("Error al añadir producto");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:5037/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  if (loading && products.length === 0) return <Spinner label="Cargando almacén..." />;

  return (
    <div className={styles.container}>
      <Title1>Gestión de Productos (Almacén)</Title1>

      {error && <MessageBar intent="error"><MessageBarTitle>Error</MessageBarTitle>{error}</MessageBar>}

      <div className={styles.form}>
        <div className={styles.field}>
          <Label htmlFor="product-name">Nombre</Label>
          <Input id="product-name" value={newProduct.name} onChange={(e, d) => setNewProduct(prev => ({ ...prev, name: d.value }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-sku">SKU</Label>
          <Input id="product-sku" value={newProduct.sku} onChange={(e, d) => setNewProduct(prev => ({ ...prev, sku: d.value }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-category">Categoría</Label>
          <Input id="product-category" value={newProduct.category} onChange={(e, d) => setNewProduct(prev => ({ ...prev, category: d.value }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-price">Precio Venta (€)</Label>
          <Input id="product-price" type="number" value={newProduct.price} onChange={(e, d) => setNewProduct(prev => ({ ...prev, price: Number(d.value) }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-cost">Coste (€)</Label>
          <Input id="product-cost" type="number" value={newProduct.cost} onChange={(e, d) => setNewProduct(prev => ({ ...prev, cost: Number(d.value) }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-stock">Stock Inicial</Label>
          <Input id="product-stock" type="number" value={newProduct.stockQuantity} onChange={(e, d) => setNewProduct(prev => ({ ...prev, stockQuantity: Number(d.value) }))} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="product-min-stock">Stock Mínimo</Label>
          <Input id="product-min-stock" type="number" value={newProduct.minStockLevel} onChange={(e, d) => setNewProduct(prev => ({ ...prev, minStockLevel: Number(d.value) }))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: 'span 1' }}>
          <Button icon={<Add24Regular />} appearance="primary" onClick={handleAdd} style={{ width: '100%' }}>Añadir Producto</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Producto (Nombre / SKU)</TableHeaderCell>
            <TableHeaderCell>Categoría</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Coste</TableHeaderCell>
            <TableHeaderCell>Precio</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold' }}>{item.name || '---'}</span>
                  <span style={{ fontSize: '12px', color: tokens.colorNeutralForeground4 }}>{item.sku}</span>
                </div>
              </TableCell>
              <TableCell>{item.category || 'General'}</TableCell>
              <TableCell>
                <span style={{ color: item.stockQuantity <= item.minStockLevel ? tokens.colorPaletteRedForeground1 : 'inherit', fontWeight: item.stockQuantity <= item.minStockLevel ? 'bold' : 'normal' }}>
                  {item.stockQuantity}
                </span>
                {item.stockQuantity <= item.minStockLevel && " ⚠️"}
              </TableCell>
              <TableCell>{item.cost}€</TableCell>
              <TableCell style={{ color: item.price < item.cost ? tokens.colorPaletteRedForeground1 : 'inherit', fontWeight: item.price < item.cost ? 'bold' : 'normal' }}>
                {item.price}€
                {item.price < item.cost && " ⚠️"}
              </TableCell>
              <TableCell>
                <Button icon={<Delete24Regular />} appearance="subtle" onClick={() => handleDelete(item.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsPage;
