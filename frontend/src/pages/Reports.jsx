import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { const load = async () => { setTransactions(await fetchTransactions()); }; load(); }, []);

  const summary = transactions.reduce((acc, t) => { 
    const key = t.productName || t.name; 
    acc[key] = (acc[key]||0) + t.quantity; 
    return acc; 
  }, {});

  const data = Object.keys(summary).map(k => ({ name: k, quantity: summary[k] }));

  return (
    <Container className="mt-4">
      <h2>Reports</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="quantity" fill="#8884d8"/>
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Reports;
