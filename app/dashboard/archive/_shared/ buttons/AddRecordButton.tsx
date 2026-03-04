import { Plus } from "lucide-react";
import { useArchiveDialogs } from "../context/ArchiveDialogsContext";

interface AddRecordButtonProps {
    sacramentType: SacramentType|null;
}
const AddRecordButton = ({ sacramentType }: AddRecordButtonProps) => {
    const { createSacrament } = useArchiveDialogs();
    const handleClick = () => {
        createSacrament.onOpenChange(true, sacramentType);
    }
    return (<button onClick={handleClick} className="flex items-center gap-2.5 rounded-lg bg-purple-700 px-4 py-2 text-white w-max">
        <Plus />
        Add New Record
    </button>);
}

export default AddRecordButton;