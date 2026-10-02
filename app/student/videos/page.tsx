import { getStudentVideos } from '@/features/videos/server/data';
import { requireRole } from '@/lib/auth/session';
import { ROLES } from '@/shared/constants/roles';
import { StudentVideoList } from '@/features/videos/components/StudentVideoList';

export default async function StudentVideosPage() {
  const session = await requireRole(ROLES.STUDENT);
  const videos = await getStudentVideos(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Class Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Watch recorded batch class sessions and video lessons from your enrolled courses.
          </p>
        </div>
      </div>

      <StudentVideoList videos={videos} />
    </div>
  );
}
