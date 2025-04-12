import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileDown, Pencil, Trash2 } from 'lucide-react';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ContactList {
  id: number;
  name: string;
}

interface Props {
  list: ContactList;
  contacts: Contact[];
}

export default function Index({ list, contacts }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const handleCreate = () => {
    router.post(`/lists/${list.id}/contacts`, formData, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        });
      }
    });
  };

  const handleUpdate = () => {
    if (editingContact) {
      router.put(`/contacts/${editingContact.id}`, editingContact, {
        onSuccess: () => setEditingContact(null)
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      router.delete(`/contacts/${id}`, {
        onSuccess: () => {
          alert('Contact supprimé avec succès');
        },
        onError: () => {
          alert('Failed to delete contact.');
        },
      });
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    window.location.href = `/lists/${list.id}/export/${format}`;
  };

  return (
    <>
      <Head title={`Contacts - ${list.name}`} />

      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts - {list.name}</h1>
          <div className="flex gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Prénom"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                  <Input
                    placeholder="Nom"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Button onClick={handleCreate} className="w-full">
                    Créer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileDown className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="pt-6">
                {editingContact?.id === contact.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editingContact.first_name}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, first_name: e.target.value })
                      }
                      placeholder="Prénom"
                    />
                    <Input
                      value={editingContact.last_name}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, last_name: e.target.value })
                      }
                      placeholder="Nom"
                    />
                    <Input
                      value={editingContact.email}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, email: e.target.value })
                      }
                      type="email"
                      placeholder="Email"
                    />
                    <Input
                      value={editingContact.phone}
                      onChange={(e) =>
                        setEditingContact({ ...editingContact, phone: e.target.value })
                      }
                      placeholder="Téléphone"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleUpdate} className="flex-1">
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingContact(null)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      <p className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingContact(contact)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <form action="{{ route('contacts.destroy', $contact->id) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Delete</button>
                      </form>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}