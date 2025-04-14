import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/app-layout';

interface Campaign {
  id: number;
  name: string;
  template_id: number | null;
  list_id: number | null;
  subject: string;
  body: string;
  start_date: string | null;
  days_active: string[];
  time_start: string | null;
  time_end: string | null;
}

interface Template {
  id: number;
  name: string;
}

interface ContactList {
  id: number;
  name: string;
}

interface Props {
  campaigns: Campaign[];
  templates: Template[];
  lists: ContactList[];
}

export default function CampaignIndex({ campaigns, templates, lists }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    template_id: null,
    list_id: null,
    subject: '',
    body: '',
    start_date: null,
    days_active: [],
    time_start: null,
    time_end: null,
  });

  const days = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  const handleCreate = () => {
    // Validate required fields
    if (!formData.name) {
      alert('Please fill in all required fields');
      return;
    }

    router.post('/campaigns', {
      name: formData.name,
      subject: formData.subject, // Optional
      body: formData.body,       // Optional
      start_date: formData.start_date,
      time_start: formData.time_start,
      time_end: formData.time_end,
      template_id: formData.template_id,
      list_id: formData.list_id,
      days_active: formData.days_active,
    }, {
      onSuccess: () => {
        alert('Campaign created successfully!'); // Show success alert
        setIsCreateOpen(false); // Close the dialog
        setFormData({
          name: '',
          template_id: null,
          list_id: null,
          subject: '',
          body: '',
          start_date: null,
          days_active: [],
          time_start: null,
          time_end: null,
        });
      },
      onError: (errors) => {
        alert('Failed to create campaign: ' + Object.values(errors).join(', '));
      }
    });
  };

  const handleUpdate = () => {
    if (editingCampaign) {
      // Ensure time_end has a valid default value
      const timeEnd = editingCampaign.time_end || '00:00';

      // Validate time_end format
      if (!/^\d{2}:\d{2}$/.test(timeEnd)) {
        alert('The time end field must match the format HH:mm (e.g., 14:30).');
        return;
      }

      router.put(`/campaigns/${editingCampaign.id}`, { ...editingCampaign, time_end: timeEnd }, {
        onSuccess: () => {
          alert('Campaign updated successfully!'); // Alert on successful update
          setEditingCampaign(null);
        },
        onError: (errors) => {
          alert('Failed to update campaign: ' + Object.values(errors).join(', ')); // Alert on error
        },
      });
    } else {
      alert('No campaign selected for update'); // Alert if no campaign is selected
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      router.delete(`/campaigns/${id}`);
    }
  };

  return (
    <AppLayout>
      <Head title="Campaigns" />

      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2 " />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Campaign Name *</label>
                  <Input
                    placeholder="Enter campaign name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Template</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.template_id || ''}
                    onChange={(e) => setFormData({ ...formData, template_id: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Contact List</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={formData.list_id || ''}
                    onChange={(e) => setFormData({ ...formData, list_id: e.target.value ? Number(e.target.value) : null })}
                  >
                    <option value="">Select a list</option>
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Subject *</label>
                  <Input
                    placeholder="Enter email subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Body *</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    placeholder="Enter email body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Active Days</label>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((day) => (
                      <label key={day.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.days_active.includes(day.value)}
                          onChange={(e) => {
                            const newDays = e.target.checked
                              ? [...formData.days_active, day.value]
                              : formData.days_active.filter((d) => d !== day.value);
                            setFormData({ ...formData, days_active: newDays });
                          }}
                        />
                        <span>{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Start Time</label>
                  <Input
                    type="time"
                    value={formData.time_start || ''}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">End Time</label>
                  <Input
                    type="time"
                    value={formData.time_end || ''}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button onClick={handleCreate} className="w-full">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="w-full">
              <CardContent className="pt-6">
                <Dialog open={editingCampaign?.id === campaign.id} onOpenChange={(isOpen) => setEditingCampaign(isOpen ? campaign : null)}>
                  <DialogTrigger asChild>
                    <div className="space-y-3 mb-4 cursor-pointer">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Subject:</span> {campaign.subject}</p>
                        <p><span className="font-medium">Start Date:</span> {campaign.start_date || 'Not set'}</p>
                        <div className="flex gap-2">
                          <span className="font-medium">Time:</span>
                          <span>{campaign.time_start || '--:--'} - {campaign.time_end || '--:--'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Active Days:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {campaign.days_active.map((day) => (
                              <span key={day} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                        {campaign.template_id && (
                          <p>
                            <span className="font-medium">Template:</span>{' '}
                            {templates.find(t => t.id === campaign.template_id)?.name}
                          </p>
                        )}
                        {campaign.list_id && (
                          <p>
                            <span className="font-medium">List:</span>{' '}
                            {lists.find(l => l.id === campaign.list_id)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                value={editingCampaign?.name || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, name: e.target.value })
                }
                placeholder="Campaign Name"
                    />
                    <Input
                value={editingCampaign?.subject || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, subject: e.target.value })
                }
                placeholder="Subject"
                    />
                    <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                value={editingCampaign?.body || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, body: e.target.value })
                }
                placeholder="Body"
                    />
                    <Input
                type="date"
                value={editingCampaign?.start_date || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, start_date: e.target.value })
                }
                placeholder="Start Date"
                    />
                    <div className="grid grid-cols-2 gap-2">
                {days.map((day) => (
                  <label key={day.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingCampaign?.days_active.includes(day.value) || false}
                      onChange={(e) => {
                    const newDays = e.target.checked
                      ? [...editingCampaign!.days_active, day.value]
                      : editingCampaign!.days_active.filter((d) => d !== day.value);
                    setEditingCampaign({ ...editingCampaign!, days_active: newDays });
                        }}
                      />
                      <span>{day.label}</span>
                    </label>
                  ))}
                      </div>
                      <Input
                type="time"
                value={editingCampaign?.time_start || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, time_start: e.target.value })
                }
                placeholder="Start Time"
                    />
                    <Input
                type="time"
                value={editingCampaign?.time_end || ''}
                onChange={(e) =>
                  setEditingCampaign({ ...editingCampaign!, time_end: e.target.value })
                }
                placeholder="End Time"
                    />
                    <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={editingCampaign?.template_id || ''}
                onChange={(e) =>
                  setEditingCampaign({
                    ...editingCampaign!,
                    template_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                    >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
                    </select>
                    <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={editingCampaign?.list_id || ''}
                onChange={(e) =>
                  setEditingCampaign({
                    ...editingCampaign!,
                    list_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                    >
                <option value="">Select a list</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
                    </select>
                    <div className="flex gap-2">
                <Button onClick={handleUpdate} className="flex-1">
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingCampaign(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setEditingCampaign({
                      ...campaign,
                      time_end: campaign.time_end || '00:00',
                      time_start: campaign.time_start || '00:00',
                    })
                  }
                >
                  <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
