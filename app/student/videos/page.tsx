import { Video } from 'lucide-react';
import Link from 'next/link';

import { getStudentVideos } from '@/features/videos/server/data';
import { getYouTubeEmbedUrl } from '@/shared/utils/youtube';
import { requireRole } from '@/lib/auth/session';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ROLES } from '@/shared/constants/roles';

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

      {videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Video className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No videos available</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Once class recordings or video lessons are added to your enrolled courses, they will show up here.
            </p>
            <Button nativeButton={false} render={<Link href="/student/courses">Browse courses</Link>} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((v) => {
            const ytEmbed = getYouTubeEmbedUrl(v.videoUrl);
            return (
              <Card key={v.id} className="flex flex-col overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {ytEmbed ? (
                    <iframe
                      src={ytEmbed}
                      title={v.title}
                      className="size-full border-0"
                      allowFullScreen
                    />
                  ) : v.videoUrl ? (
                    <video controls src={v.videoUrl} className="size-full" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      No video available
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{v.courseTitle}</span>
                    <Badge variant="outline">{v.batchName ?? v.sectionTitle}</Badge>
                  </div>
                  <CardTitle className="text-base font-semibold leading-snug">{v.title}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
