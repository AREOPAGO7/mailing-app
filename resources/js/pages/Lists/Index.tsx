import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';

interface ContactList {
  id: number;
  name: string;
  contacts_count: number;
}

interface Props {
  lists: ContactList[];
}

export default function Index({ lists }: Props) {
  return (
    <>
      <Head title="Listes de contacts" />
      <div className="container py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{list.contacts_count} contacts</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}