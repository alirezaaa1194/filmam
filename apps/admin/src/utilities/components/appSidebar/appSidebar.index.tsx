import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLayout } from '@/context'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/utilities/components'
import { SidebarHeaderBlock } from '../sidebarHeader/sidebarHeader.index'
import { getSidebarData } from './appSidebar.data'
import { NavGroup } from '../navGroup/navGroup.index'

export function AppSidebar() {
  const { t } = useTranslation()
  const { collapsible, variant } = useLayout()
  const sidebarData = useMemo(() => getSidebarData(t), [t])
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SidebarHeaderBlock />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
