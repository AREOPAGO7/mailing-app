import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import AppLayout from '@/Layouts/app-layout';
import EmailEditor from 'react-email-editor';

interface Template {
  id: number;
  name: string;
  content: string;
  preview: string;
}

interface Props {
  templates: Template[];
}

export default function TemplateIndex({ templates }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<Template | null>(null);
  const emailEditorRef = useRef<any>(null);

  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;

      router.post('/templates', {
        name: templateName,
        content: html,
        design: JSON.stringify(design), // Save design as JSON
      }, {
        onSuccess: () => {
          alert('Template created successfully!'); // Show success alert
          setIsCreateOpen(false); // Close the dialog
          setTemplateName(''); // Reset the template name
          router.reload(); // Refresh the page to see changes
        },
        onError: (errors) => {
          console.error('Failed to create template:', errors);
        },
      });
    });
  };

  const handleUpdateTemplate = () => {
      if (!editingTemplate) {
          console.error('No template selected for editing.');
          return;
      }

      emailEditorRef.current.editor.exportHtml((data) => {
          const { design, html } = data;

          router.put(`/templates/${editingTemplate.id}`, {
              name: templateName || editingTemplate.name,
              content: html,
              design: JSON.stringify(design), // Save updated design
          }, {
              onSuccess: () => {
                  alert('Template updated successfully!'); // Show success alert
                  setEditingTemplate(null); // Close the update dialog
                  router.reload(); // Refresh the page to see changes
              },
              onError: (errors) => {
                  console.error('Failed to update template:', errors);
              },
          });
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      router.delete(`/templates/${id}`, {
        onSuccess: () => {
          console.log('Template deleted successfully!');
          router.reload(); // Refresh the page to see changes
        },
        onError: (errors) => {
          console.error('Failed to delete template:', errors);
        },
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Templates" />

      <div className="p-4 sm:p-6">
        {/* Create Button + Modal */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent
              className="w-screen h-screen p-0 overflow-hidden flex flex-col"
              style={{ maxWidth: '100vw', maxHeight: '100vh' }}
            >
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <div className="p-4">
                  <Input
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="mb-4"
                  />
                </div>
              </DialogHeader>
              <div style={{ flex: 1, height: 'calc(100vh - 8rem)' }}>
                <EmailEditor
                  ref={emailEditorRef}
                  onLoad={() => console.log('EmailEditor is loaded and ready')}
                />
              </div>
              <div className="p-4 bg-white border-t sticky bottom-0">
                <Button onClick={handleSaveTemplate} className="w-full">
                  Save Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Template Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="w-full">
              <CardContent className="pt-6">
                {/* Edit Modal */}
                <Dialog
                  open={editingTemplate?.id === template.id}
                  onOpenChange={(isOpen) => setEditingTemplate(isOpen ? template : null)}
                >
                  <DialogTrigger asChild>
                    <div className="space-y-3 mb-4 cursor-pointer">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.preview}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    className="w-screen h-screen p-0 overflow-hidden"
                    style={{ maxWidth: '100vw', maxHeight: '100vh' }}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Template</DialogTitle>
                      <div className="p-4">
                        <Input
                          placeholder="Enter template name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          className="mb-4"
                        />
                      </div>
                    </DialogHeader>
                    <div style={{ height: 'calc(100vh - 4rem)' }}>
                      <EmailEditor
                        ref={(ref) => {
                          emailEditorRef.current = ref;
                        }}
                        onLoad={() => {
                          if (editingTemplate?.design) {
                            try {
                              const design = JSON.parse(editingTemplate.design); // Use design field
                              emailEditorRef.current.editor.loadDesign(design);
                            } catch (error) {
                              console.error('Failed to load template design:', error);
                            }
                          }
                          if (editingTemplate?.name) {
                            setTemplateName(editingTemplate.name); // Pre-fill the name input
                          }
                        }}
                      />
                    </div>
                    <div className="p-4 bg-white border-t sticky bottom-0">
                      <Button onClick={handleUpdateTemplate} className="w-full">
                        Update Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPreviewingTemplate(template)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog
        open={!!previewingTemplate}
        onOpenChange={() => setPreviewingTemplate(null)}
      >
        <DialogContent
          className="w-screen h-screen p-4 overflow-auto"
          style={{ maxWidth: '100vw', maxHeight: '100vh' }}
        >
          <DialogHeader>
            <DialogTitle>Preview Template</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-white border rounded">
            {previewingTemplate?.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: previewingTemplate.content }}
              />
            ) : (
              <p>No preview available for this template.</p>
            )}
          </div>
          <div className="mt-4">
            <Button onClick={() => setPreviewingTemplate(null)} className="w-full">
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}