import { useLayout } from '@/context'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/utilities/components'
import { TeamSwitcher } from '../teamSwitcher/teamSwitcher.index'
import { sidebarData } from './appSidebar.data'
import { NavGroup } from '../navGroup/navGroup.index'
import { NavUser } from '../navUser/navUser.index'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
