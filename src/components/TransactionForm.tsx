import React, { useState } from 'react';
import { Product, Transaction } from '../types';

interface TransactionFormProps {
  products: Product[];
  onSubmit: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ products, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'id' | 'date'>>({
    productId: '',
    type: 'in',
    quantity: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Selecione um produto';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }
    
    // Check if there's enough stock for outgoing transactions
    if (formData.type === 'out') {
      const product = products.find(p => p.id === formData.productId);
      if (product && product.quantity < formData.quantity) {
        newErrors.quantity = `Estoque insuficiente. Disponível: ${product.quantity}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      setFormData({
        productId: '',
        type: 'in',
        quantity: 1,
        notes: '',
      });
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
          Produto
        </label>
        <select
          id="productId"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.productId ? 'border-red-500' : 'border'
          }`}
        >
          <option value="">Selecione um produto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - Estoque: {product.quantity}
            </option>
          ))}
        </select>
        {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Movimentação</label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="in"
              checked={formData.type === 'in'}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Entrada</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="out"
              checked={formData.type === 'out'}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Saída</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantidade
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.quantity ? 'border-red-500' : 'border'
          }`}
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
        
        {selectedProduct && (
          <p className="mt-1 text-sm text-gray-500">
            Estoque atual: {selectedProduct.quantity} unidades
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
        />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Registrar Movimentação
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;