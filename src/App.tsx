import React, { useState, useEffect } from 'react';
import { Layers, Package, AlertTriangle, BarChart2, PlusCircle, MinusCircle, Search } from 'lucide-react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import TransactionForm from './components/TransactionForm';
import LowStockAlerts from './components/LowStockAlerts';
import StockReport from './components/StockReport';
import { Product, Transaction } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');

  
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      quantity: Number(product.quantity),
      price: Number(product.price),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Update product quantity
    const product = products.find(p => p.id === transaction.productId);
    if (product) {
      const updatedQuantity = transaction.type === 'in' 
        ? product.quantity + Number(transaction.quantity)
        : product.quantity - Number(transaction.quantity);
      
      updateProduct({
        ...product,
        quantity: updatedQuantity
      });
    }
    
    setTransactions([...transactions, newTransaction]);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(product => product.quantity <= 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <Layers className="mr-2" />
              Sistema de Gestão de Estoque
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="py-2 px-4 pr-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-3 flex items-center ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('products')}
            >
              <Package className="mr-2" size={18} />
              Produtos
            </button>
            <button
              className={`px-4 py-3 flex items-center ${activeTab === 'transactions' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('transactions')}
            >
              <PlusCircle className="mr-2" size={18} />
              Entrada/Saída
            </button>
            <button
              className={`px-4 py-3 flex items-center ${activeTab === 'alerts' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('alerts')}
            >
              <AlertTriangle className="mr-2" size={18} />
              Alertas
              {lowStockProducts.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {lowStockProducts.length}
                </span>
              )}
            </button>
            <button
              className={`px-4 py-3 flex items-center ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('reports')}
            >
              <BarChart2 className="mr-2" size={18} />
              Observações
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Produto</h2>
              <ProductForm onSubmit={addProduct} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Lista de Produtos</h2>
              <ProductList 
                products={filteredProducts} 
                onUpdate={updateProduct} 
                onDelete={deleteProduct} 
              />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Registrar Movimentação</h2>
              <TransactionForm products={products} onSubmit={addTransaction} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Histórico de Movimentações</h2>
              <StockReport transactions={transactions} products={products} />
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Alertas de Estoque Baixo</h2>
            <LowStockAlerts products={products} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Relatório de Movimentação</h2>
            <StockReport transactions={transactions} products={products} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p> &copy; {new Date().getFullYear()} Nathan Porto, Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;