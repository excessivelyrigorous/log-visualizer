import WeaponAk47 from "../assets/svg_normal/weapon_ak47.svg?react"
import Glock from "../assets/svg_normal/weapon_glock.svg?react"
import M4a1 from "../assets/svg_normal/weapon_m4a1.svg?react"
import M4a1Silencer from "../assets/svg_normal/weapon_m4a1_silencer.svg?react"
import Sg556 from "../assets/svg_normal/weapon_sg556.svg?react"
import UspSilencer from "../assets/svg_normal/weapon_usp_silencer.svg?react"
import Deagle from "../assets/svg_normal/weapon_deagle.svg?react"
import Mp9 from "../assets/svg_normal/weapon_mp9.svg?react"
import Tec9 from "../assets/svg_normal/weapon_tec9.svg?react"
import Galilar from "../assets/svg_normal/weapon_galilar.svg?react"
import Mac10 from "../assets/svg_normal/weapon_mac10.svg?react"
import Awp from "../assets/svg_normal/weapon_awp.svg?react"
import Taser from "../assets/svg_normal/weapon_taser.svg?react"
import Elite from "../assets/svg_normal/weapon_elite.svg?react"
import Famas from "../assets/svg_normal/weapon_famas.svg?react"
import P250 from "../assets/svg_normal/weapon_p250.svg?react"

export const WeaponIcon = ({ id, className }: { id: string, className: React.ComponentProps<'div'>['className'] }) => {
    switch (id) {
        case "ak47":
            return <WeaponAk47 className={className} />
        case "glock":
            return <Glock className={className} />
        case "m4a1":
            return <M4a1 className={className} />
        case 'm4a1_silencer':
            return <M4a1Silencer className={className} />
        case 'sg556':
            return <Sg556 className={className} />
        case 'usp_silencer':
            return <UspSilencer className={className} />
        case 'deagle':
            return <Deagle className={className} />
        case 'mp9':
            return <Mp9 className={className} />
        case 'tec9':
            return <Tec9 className={className} />
        case 'galilar':
            return <Galilar className={className} />
        case 'mac10':
            return <Mac10 className={className} />
        case 'awp':
            return <Awp className={className} />
        case 'taser':
            return <Taser className={className} />
        case 'elite':
            return <Elite className={className} />
        case 'famas':
            return <Famas className={className} />
        case 'p250':
            return <P250 className={className} />
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>

    }
}