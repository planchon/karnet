import { observer } from 'mobx-react';
import { usePathname } from 'next/navigation';
import { Link } from 'react-router';
import { useSettings } from '@/hooks/useStores';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem } from '@/primitive/ui/sidebar';
import { TooltipWrapper } from './tooltip-wrapper';

type SuperLinkProps = {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    tooltip: {
        title: string;
        side?: 'top' | 'right' | 'bottom' | 'left';
        shortcut?: string[];
    };
} & React.ComponentProps<typeof Link>;

export const SuperLink = observer(function SuperLink({ title, icon: Icon, tooltip, ...props }: SuperLinkProps) {
    const settings = useSettings();
    const linkEnabled = !settings.disableLinks;

    const isActive = usePathname().includes(props.to.toString());

    return (
        <Link
            className={cn(
                'rounded-[4px] text-accent-foreground hover:cursor-pointer',
                !linkEnabled && 'pointer-events-none select-none'
            )}
            draggable={false}
            key={title}
            tabIndex={-1}
            {...props}
        >
            <TooltipWrapper className="w-full" tooltip={tooltip}>
                <SidebarMenuItem className="hover:cursor-pointer" key={title} tabIndex={-1}>
                    <SidebarMenuButton className="group/item" tooltip={title}>
                        {Icon && (
                            <Icon className={cn(isActive ? 'text-accent-foreground' : 'text-accent-foreground/80')} />
                        )}
                        <span className="truncate">{title}</span>{' '}
                    </SidebarMenuButton>
                </SidebarMenuItem>{' '}
            </TooltipWrapper>
        </Link>
    );
});
