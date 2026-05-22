import { BarChart3Icon, LayoutDashboardIcon, MapIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Map",
        url: "/map",
        icon: MapIcon,
    },
    {
        title: "Statistics",
        url: "/statistics",
        icon: BarChart3Icon,
    },
    {
        title: "Team Leaders",
        url: "/admin/team_leaders",
        icon: UsersIcon,
    },
]

const MapSidebar = () => {
    return (
        <div className="fixed top-20 left-[7px] h-[calc(100%-90px)] z-10 px-0.5 py-5 bg-white/5 backdrop-blur rounded-lg border border-black/10 flex flex-col items-center">
            {items.map(item => (
                <Tooltip key={item.title}>
                    <TooltipTrigger asChild>
                        <Link href={item.url} className={`${item.title == 'Map' ? "bg-white/30" : ""} flex items-center gap-2 p-2 mb-1 rounded-md hover:bg-white/50 transition-colors`}>
                            <item.icon className="h-4 w-4" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{item.title}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    )
}

export default MapSidebar