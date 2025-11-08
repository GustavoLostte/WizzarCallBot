import React, { useState } from 'react';
import { useVoip } from '../context/VoipContext';
import { Contact } from '../types';
import Button from './Button';

const ContactList: React.FC = () => {
  const { contacts, startCall } = useVoip();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm)
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Contactos</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar contacto..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredContacts.length === 0 ? (
        <p className="text-gray-500">No se encontraron contactos.</p>
      ) : (
        <ul className="flex-grow overflow-y-auto">
          {filteredContacts.map((contact: Contact) => (
            <li
              key={contact.id}
              className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.number}</p>
                <div className="flex flex-wrap mt-1">
                  {contact.labels.map((label) => (
                    <span
                      key={label}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-1 mb-1"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <Button
                  onClick={() => startCall(contact.number)}
                  size="sm"
                  variant="primary"
                  className="px-2 py-1 text-sm"
                >
                  Llamar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactList;
