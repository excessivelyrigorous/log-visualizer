import type { Kill } from "../api/models/processedModels";
import { timeToString } from "../utils/time";
import { WeaponIcon } from "./WeaponIcon";

const TooltipContent = ({ kill }: { kill: Kill }) => <div className="flex flex-col gap-2">
    <div>{timeToString(kill.time)}</div>
    <div className="flex gap-1">
        <div>{kill.player1}</div>
        <WeaponIcon id={kill.weapon} className="w-6 h-6 fill-yellow-400" />
        <div>{kill.player2}</div>
    </div>
</div>

export const WeaponRow = ({ kills }: { kills: Kill[]; }) => {
    return <div className="flex flex-row gap-1">
        {kills.map((kill, idx) =>
            <div className={idx === 0 && kills.length > 1 ? "tooltip tooltip-left" : idx === kills.length - 1 && kills.length > 1 ? "tooltip tooltip-right" : "tooltip"}>
                <div className="tooltip-content">
                    <TooltipContent kill={kill} />
                </div>
                <WeaponIcon id={kill.weapon} className="w-6 h-6 fill-yellow-400" />
            </div>
        )}
    </div>;
};
