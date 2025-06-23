import React, { useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdate(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editForm) return;
    
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    });
  };

  if (products.length === 0) {
    return <p className="text-gray-500 italic">Nenhum produto cadastrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço (R$)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product.id} className={product.quantity <= 5 ? 'bg-red-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === product.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm?.name || ''}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === product.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editForm?.description || ''}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500">{product.description}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === product.id ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editForm?.quantity || 0}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-24"
                    min="0"
                  />
                ) : (
                  <div className={`text-sm ${product.quantity <= 5 ? 'text-red-600 font-bold' : 'text-gray-900'}`}>
                    {product.quantity}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === product.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editForm?.price || 0}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-24"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <div className="text-sm text-gray-900">{product.price.toFixed(2)}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === product.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;