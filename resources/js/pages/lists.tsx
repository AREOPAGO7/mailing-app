import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

interface ContactList {
  id: number;
  name: string;
  contacts_count: number;
}

interface Props {
  lists: ContactList[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Campaigns',
        href: '/campaigns',
    },
];

export default function Dashboard({ lists }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [editingList, setEditingList] = useState<ContactList | null>(null);

    const handleCreate = () => {
        if (!newListName.trim()) {
            alert('Please enter a list name');
            return;
        }

        router.post('/lists', { name: newListName }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setNewListName('');
            },
            onError: (errors) => {
                alert('Failed to create list: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleUpdate = () => {
        if (editingList) {
            if (!editingList.name.trim()) {
                alert('Please enter a list name');
                return;
            }

            router.put(`/lists/${editingList.id}`, { name: editingList.name }, {
                onSuccess: () => setEditingList(null),
                onError: (errors) => {
                    alert('Failed to update list: ' + Object.values(errors).join(', '));
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this list?')) {
            router.delete(`/lists/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Contact Lists</h1>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create List
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New List</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter list name"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                />
                                <Button onClick={handleCreate} className="w-full">
                                    Create List
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {lists.map((list) => (
                        <Card key={list.id} className="w-full">
                            <CardContent className="pt-6">
                                {editingList?.id === list.id ? (
                                    <div className="space-y-4">
                                        <Input
                                            value={editingList.name}
                                            onChange={(e) =>
                                                setEditingList({ ...editingList, name: e.target.value })
                                            }
                                            placeholder="List Name"
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={handleUpdate} className="flex-1">
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditingList(null)}
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-4">
                                            <p className="font-medium">{list.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Users className="w-4 h-4 mr-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
                                                {list.contacts_count} contacts
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/lists/${list.id}/contacts`}>
                                                <Button variant="outline" size="icon">
                                                    <Users className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setEditingList(list)}
                                            >
                                                <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(list.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
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
