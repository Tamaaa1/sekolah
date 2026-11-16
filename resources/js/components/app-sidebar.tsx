import { useLayoutEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    AcademicCapIcon,
    ArrowTopRightOnSquareIcon,
    Bars3BottomLeftIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    CameraIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    HomeIcon,
    MegaphoneIcon,
    NewspaperIcon,
    PhotoIcon,
    TrophyIcon,
    UserGroupIcon,
    UsersIcon,
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
        title: 'Guru & Staf TU',
        href: '/admin/staff',
        icon: AcademicCapIcon,
    },
    {
        title: 'Ekstrakurikuler',
        href: '/admin/extracurriculars',
        icon: UserGroupIcon,
    },
    {
        title: 'Sarana & Fasilitas',
        href: '/admin/facilities',
        icon: BuildingOffice2Icon,
    },
    {
        title: 'Galeri Kegiatan',
        href: '/admin/galleries',
        icon: CameraIcon,
    },
    {
        title: 'Pesan Masuk',
        href: '/admin/messages',
        icon: EnvelopeIcon,
    },
    {
        title: 'Prestasi Siswa',
        href: '/admin/achievements',
        icon: TrophyIcon,
    },
    {
        title: 'Agenda Akademik',
        href: '/admin/agendas',
        icon: CalendarDaysIcon,
    },
    {
        title: 'Pustaka Media',
        href: '/admin/media',
        icon: PhotoIcon,
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
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
        icon: UsersIcon,
    },
    {
        title: 'Log Aktivitas',
        href: '/admin/activity-logs',
        icon: ClipboardDocumentListIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Portal Publik',
        href: '/',
        icon: ArrowTopRightOnSquareIcon,
    },
];

let cachedSidebarScroll = 0;

export function AppSidebar() {
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!contentRef.current) return;
        const saved =
            cachedSidebarScroll ||
            Number(sessionStorage.getItem('admin_sidebar_scroll') || 0);
        if (saved > 0) {
            contentRef.current.scrollTop = saved;
        }
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const top = e.currentTarget.scrollTop;
        cachedSidebarScroll = top;
        try {
            sessionStorage.setItem('admin_sidebar_scroll', String(top));
        } catch {}
    };

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

            <SidebarContent
                ref={contentRef}
                onScroll={handleScroll}
                data-scroll-region
            >
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
