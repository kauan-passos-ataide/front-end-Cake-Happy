'use client';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function BreadcrumbWithCustomSeparator({
  currentPath,
}: {
  currentPath: string;
}) {
  const paths = currentPath.split('/').filter(Boolean); // remove strings vazias

  const fullPaths = paths.map((_, i) => '/' + paths.slice(0, i + 1).join('/'));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((segment, i) => (
          <div key={fullPaths[i]} className="flex items-center gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={fullPaths[i]}
                  className={`${currentPath === fullPaths[i] && 'text-cake-happy-dark font-semibold'}`}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < paths.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
