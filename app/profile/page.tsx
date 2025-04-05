"use client"

import {AppSidebar} from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Profile() {
    return (
        <SidebarProvider>
            <AppSidebar/>
        </SidebarProvider>
    )
}