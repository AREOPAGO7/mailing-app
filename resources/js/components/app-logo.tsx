import { Inbox } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="relative w-10 h-10 group flex items-center justify-center">
                <Inbox className="h-6 w-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors duration-200" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Mailing app</span>
            </div>
        </>
    );
}