import type { CSSProperties, ReactNode } from 'react';
import { ruinsPanelStyle } from '../../utils/ruinsStyles';

interface RuinsPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function RuinsPanel({ children, className = '', style }: RuinsPanelProps) {
  return (
    <div
      className={`panel panel-ruins ${className}`}
      style={{ ...ruinsPanelStyle(), ...style }}
    >
      {children}
    </div>
  );
}
