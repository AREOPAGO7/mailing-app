import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface SmtpConfig {
    mail_username: string;
    mail_password: string;
    mail_from_address: string;
}

interface Props {
    smtpConfig: SmtpConfig | null;
}

export default function SmtpConfigIndex({ smtpConfig }: Props) {
    const [formData, setFormData] = useState({
        mail_username: smtpConfig?.mail_username || '',
        mail_password: smtpConfig?.mail_password || '',
        mail_from_address: smtpConfig?.mail_from_address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/smtp-config', formData, {
            onSuccess: () => {
                alert('SMTP configuration saved successfully!');
            },
            onError: (errors) => {
                alert('Failed to save SMTP configuration: ' + Object.values(errors).join(', '));
            },
        });
    };

    return (
        <AppLayout>
            <Head title="SMTP Configuration" />

            <div className="p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-6">SMTP Configuration</h1>

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="mail_username" className="text-sm font-medium block mb-1">
                                    Mail Username
                                </label>
                                <Input
                                    id="mail_username"
                                    type="email"
                                    value={formData.mail_username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mail_username: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="mail_password" className="text-sm font-medium block mb-1">
                                    Mail Password
                                </label>
                                <Input
                                    id="mail_password"
                                    type="password"
                                    value={formData.mail_password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mail_password: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="mail_from_address" className="text-sm font-medium block mb-1">
                                    Mail From Address
                                </label>
                                <Input
                                    id="mail_from_address"
                                    type="email"
                                    value={formData.mail_from_address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, mail_from_address: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Save Configuration
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}