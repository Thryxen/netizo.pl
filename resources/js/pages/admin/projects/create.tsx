import { AdminLayout } from '@/components/admin/admin-layout';
import { ProjectForm } from '@/components/admin/project-form';
import { adminRoutes } from '@/lib/admin-routes';
import type { AdminServiceOption } from '@/types/admin';

export default function ProjectCreate({ nextSortOrder, serviceOptions }: { nextSortOrder: number; serviceOptions: AdminServiceOption[] }) {
    return (
        <AdminLayout title="Nowy projekt" breadcrumbs={[{ title: 'Projekty', href: adminRoutes.projects.index }]}>
            <ProjectForm nextSortOrder={nextSortOrder} serviceOptions={serviceOptions} />
        </AdminLayout>
    );
}
