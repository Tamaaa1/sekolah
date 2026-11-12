import { Link } from '@inertiajs/react';
import {
    ArrowTopRightOnSquareIcon,
    Bars3BottomLeftIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    HomeIcon,
    MegaphoneIcon,
    NewspaperIcon,
} from '@heroicons/react/24/outline';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: HomeIcon,
    },
    {
        title: 'Berita & Artikel',
        href: '/admin/posts?type=post',
        icon: NewspaperIcon,
    },
    {
        title: 'Halaman Statis',
        href: '/admin/posts?type=page',
        icon: DocumentTextIcon,
    },
    {
        title: 'Pengumuman Resmi',
        href: '/admin/posts?type=announcement',
        icon: MegaphoneIcon,
    },
    {
        title: 'Menu Navigasi',
        href: '/admin/menus',
        icon: Bars3BottomLeftIcon,
    },
    {
        title: 'Pengaturan Sekolah',
        href: '/admin/settings',
        icon: Cog6ToothIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Portal Publik',
        href: '/',
        icon: ArrowTopRightOnSquareIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
