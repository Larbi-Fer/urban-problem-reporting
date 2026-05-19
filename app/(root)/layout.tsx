

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TooltipProvider>
            <SidebarProvider defaultOpen={false}>
                <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <main className="flex-1 flex flex-col min-h-screen w-full bg-background overflow-x-hidden">
                        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-4 md:px-6">
                            <SidebarTrigger className="-ml-1" />
                            <div className="h-4 w-px bg-border/40 mx-2" />
                        </header>
                        <div className="flex-1">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    )
}

