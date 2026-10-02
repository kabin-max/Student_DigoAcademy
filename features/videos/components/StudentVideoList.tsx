'use client';

import { PlayCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { VideoOverview } from '@/features/videos/server/data';

export function StudentVideoList({ videos }: { videos: VideoOverview[] }) {
  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
        No class recordings or video lessons have been uploaded yet.
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-2xl border border-border/70 bg-card shadow-sm">
      {videos.map((video) => (
        <li key={video.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-sm leading-snug">{video.title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {video.batchName ? 'BATCH' : 'LESSON'}
              </Badge>
              <span className="truncate font-medium">{video.courseTitle}</span>
              {(video.batchName || video.sectionTitle) && <span>·</span>}
              <span className="truncate">{video.batchName ?? video.sectionTitle}</span>
              {video.instructorName && (
                <>
                  <span>·</span>
                  <span className="truncate">By {video.instructorName}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex shrink-0 items-center gap-2">
            {video.videoUrl ? (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                nativeButton={false}
                render={
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-1.5 size-4" /> Watch
                  </a>
                }
              />
            ) : (
              <span className="text-xs text-muted-foreground px-2">Unavailable</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
