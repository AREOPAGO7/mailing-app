import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileDown, FileUp, Pencil, Trash2, Mail, Phone, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Contact } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    list: {
        id: number;
        name: string;
        contacts: Contact[];
    };
}

export default function Show({ list }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    const handleCreate = () => {
        if (!formData.first_name || !formData.last_name || !formData.email) {
            alert('Please fill in all required fields');
            return;
        }

        router.post(`/lists/${list.id}/contacts`, formData, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: ''
                });
            },
            onError: (errors) => {
                alert('Failed to create contact: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleUpdate = (contact: Contact) => {
        if (!contact.first_name || !contact.last_name || !contact.email) {
            alert('Please fill in all required fields');
            return;
        }

        router.put(`/contacts/${contact.id}`, contact, {
            onSuccess: () => setEditingContact(null),
            onError: (errors) => {
                alert('Failed to update contact: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            router.delete(`/contacts/${id}`);
        }
    };

    function handleExport() {
        const fields = ['first_name', 'last_name', 'email', 'phone'];
        const contacts = list.contacts.map((contact) => {
            const { first_name, last_name, email, phone } = contact;
            return { first_name, last_name, email, phone };
        });
        const csv = Papa.unparse(contacts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${list.name}-contacts.csv`);
    }

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                Papa.parse(file, {
                    complete: (results) => {
                        const contacts = results.data;
                        router.post(`/lists/${list.id}/contacts/import`, { contacts });
                    },
                    header: true
                });
            }
        };
        input.click();
    };

    return (
        <AppLayout>
            <Head title={`${list.name} - Contacts`} />
            <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{list.name}</h1>
                    <div className="flex gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Contact
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Contact</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">First Name *</label>
                                        <Input
                                            placeholder="Enter first name"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Last Name *</label>
                                        <Input
                                            placeholder="Enter last name"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium mb-1 block">Email *</label>
                                        <Input
                                            type="email"
                                            placeholder="Enter email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium mb-1 block">Phone</label>
                                        <Input
                                            placeholder="Enter phone number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button onClick={handleCreate} className="w-full">
                                            Create Contact
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={handleExport}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button variant="outline" onClick={handleImport}>
                            <FileUp className="w-4 h-4 mr-2" />
                            Import CSV
                        </Button>
                        <Button variant="outline" onClick={() => router.get('/lists')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Lists
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {list.contacts.map((contact) => (
                        <Card key={contact.id} className="w-full">
                            <CardContent className="pt-6">
                                {editingContact?.id === contact.id ? (
                                    <div className="space-y-4">
                                        <Input
                                            value={editingContact.first_name}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, first_name: e.target.value })
                                            }
                                            placeholder="First Name"
                                        />
                                        <Input
                                            value={editingContact.last_name}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, last_name: e.target.value })
                                            }
                                            placeholder="Last Name"
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
                                            placeholder="Phone"
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleUpdate(editingContact)} className="flex-1">
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditingContact(null)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-4">
                                            <p className="font-medium">
                                                {contact.first_name} {contact.last_name}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Mail className="w-4 h-4 mr-1" />
                                                {contact.email}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Phone className="w-4 h-4 mr-1" />
                                                {contact.phone}
                                            </p>
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
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}