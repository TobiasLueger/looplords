import type { ReactNode } from 'react';
import { RUINS_BACKGROUNDS } from '../../utils/ruinsAssets';

interface ScreenLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  titleIcon?: string;
}

export function ScreenLayout({ children, title, subtitle, titleIcon }: ScreenLayoutProps) {
  return (
    <div
      className="screen-bg relative flex min-h-screen flex-col items-center px-4 py-8"
      style={{ backgroundImage: `url(${RUINS_BACKGROUNDS.menu})` }}
    >
      <div className="w-full max-w-4xl flex-1">
        {title && (
          <header className="mb-8 text-center">
            {titleIcon && (
              <img
                src={titleIcon}
                alt=""
                className="mx-auto mb-3 h-14 w-14 object-contain drop-shadow-lg"
                draggable={false}
              />
            )}
            <h1 className="font-display text-4xl font-bold tracking-wide text-loop-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-loop-muted drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
