import React, { useState, useEffect } from 'react';
import {
  Title1, Title2, Text, Card, CardHeader,
  Spinner, MessageBar, MessageBarTitle,
  Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell,
  tokens, makeStyles, shorthands
} from '@fluentui/react-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    padding: '20px',
  },
  chartContainer: {
    height: '300px',
    width: '100%',
    marginTop: '100px',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: tokens.colorBrandForeground1,
  }
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
  const styles = useStyles();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5037/api/inventorydashboard/summary')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar datos del panel');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner label="Cargando panel de almacén..." />;
  if (error) return (
    <MessageBar intent="error">
      <MessageBarTitle>Error</MessageBarTitle>
      {error}. Asegúrate de que el Backend esté encendido.
    </MessageBar>
  );

  return (
    <div>
      <Title1>Dashboard de Almacén</Title1>
      <br />
      <Text>Estado actual del inventario y métricas clave.</Text>

      <div className={styles.grid}>
        <Card className={styles.card}>
          <CardHeader header={<Text weight="semibold">Total Productos</Text>} />
          <div className={styles.kpiValue}>{data.totalProducts}</div>
        </Card>
        <Card className={styles.card}>
          <CardHeader header={<Text weight="semibold">Stock Total</Text>} />
          <div className={styles.kpiValue}>{data.totalStock} uds</div>
        </Card>
        <Card className={styles.card}>
          <CardHeader header={<Text weight="semibold">Valor Inventario (Venta)</Text>} />
          <div className={styles.kpiValue}>{data.totalValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
        </Card>
        <Card className={styles.card}>
          <CardHeader header={<Text weight="semibold">Costo Inventario (Adquisición)</Text>} />
          <div className={styles.kpiValue} style={{ color: tokens.colorNeutralForeground1 }}>
            {data.totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </div>
        </Card>
        <Card className={styles.card} style={{ borderLeft: `5px solid ${data.lowStockCount > 0 ? tokens.colorPaletteRedForeground1 : tokens.colorPaletteGreenForeground1}` }}>
          <CardHeader header={<Text weight="semibold">Alertas Stock Bajo</Text>} />
          <div className={styles.kpiValue}>{data.lowStockCount}</div>
        </Card>
      </div>

      <div className={styles.grid}>
        <Card className={styles.card}>
          <CardHeader header={<Title2>Niveles de Stock vs Mínimo</Title2>} />
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.stockLevels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stockQuantity" name="Stock Actual" fill="#0078d4" />
                <Bar dataKey="minStockLevel" name="Nivel Mínimo" fill="#d13438" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Title2>Distribución de Stock</Title2>} />
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.stockLevels}
                  dataKey="stockQuantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.stockLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.Colors?.length || index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
