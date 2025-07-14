import { NavLink, type NavLinkProps } from 'react-router';
import { useSettings } from '@/hooks/useStores';

// this is the componenet made to disable all the link in the app
// because this app should be keyboard shortcuts only
export const Link = ({ children, className, to, ...props }: NavLinkProps) => {
  const settings = useSettings();

  if (!settings.disableLinks) {
    return (
      <NavLink className={className} to={to} {...props}>
        {children}
      </NavLink>
    );
  }

  return (
    <div className={className as string} {...props}>
      {/* @ts-ignore i dont know why this is not working */}
      {children}
    </div>
  );
};
