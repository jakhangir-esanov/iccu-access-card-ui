import { useQuery } from '@tanstack/react-query';
import { ImageOffIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { apiClient } from '@core/http/api-client';
import { cn } from 'cn';

const FILE_QUERY_ROOT = 'files';
const FILE_GC_TIME_MS = 10 * 60_000;

interface AuthorizedImageProps {
  readonly fileId: string;
  readonly alt: string;
  readonly className?: string;
  readonly onLoad?: () => void;
}

export function AuthorizedImage({ fileId, alt, className, onLoad }: AuthorizedImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const file = useQuery({
    queryKey: [FILE_QUERY_ROOT, fileId],
    queryFn: () => apiClient.getFile(`/files/${fileId}/content`),
    staleTime: Infinity,
    gcTime: FILE_GC_TIME_MS,
  });

  useEffect(() => {
    const image = imageRef.current;
    const blob = file.data?.blob;
    if (image === null || blob === undefined) {
      return;
    }
    const url = URL.createObjectURL(blob);
    image.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file.data]);

  if (file.isError) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <ImageOffIcon className="size-1/3 text-muted-foreground" aria-label={alt} />
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden bg-muted', className)}>
      <img
        ref={imageRef}
        alt={alt}
        onLoad={onLoad}
        className={cn('size-full object-cover', file.data === undefined && 'invisible')}
      />
    </div>
  );
}
