"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useArchiveDialogs } from "../context/ArchiveDialogsContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateSacramentDialog = () => {
    const { createSacrament } = useArchiveDialogs();
    return (
        <Dialog open={createSacrament.isOpen} onOpenChange={createSacrament.onOpenChange}>
            <DialogTrigger>
               
                    Create Sacrament
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Sacrament
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <Label>Sacrament Type</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sacrament type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="baptism">Baptism</SelectItem>
                                <SelectItem value="confirmation">Confirmation</SelectItem>
                                <SelectItem value="eucharist">Eucharist</SelectItem>
                                <SelectItem value="reconciliation">Reconciliation</SelectItem>
                                <SelectItem value="anointing of the sick">Anointing of the Sick</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateSacramentDialog;