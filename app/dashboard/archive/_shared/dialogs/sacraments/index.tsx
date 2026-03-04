"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArchiveDialogs } from "../../context/ArchiveDialogsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  sacramentNameFromType,
  useSacramentTypesContext,
} from "@/context/prefetch/SacramentTypesContext";
import Divider from "@/components/ui/divider";
import { useEffect, useState } from "react";
import BaptismForm from "./BaptismForm";
import ConfirmationForm from "./ConfirmationForm";
import HolyCommunionForm from "./HolyCommunionForm";
import HolyOrdersForm from "./HolyOrdersForm";
import MatrimonyForm from "./MatrimonyForm";

const CreateSacramentDialog = () => {
  const { createSacrament } = useArchiveDialogs();
  const [sacramentType, setSacramentType] = useState<SacramentType>(
    (createSacrament.sacramentType as SacramentType) ?? "baptism"
  );
  const { sacramentTypes } = useSacramentTypesContext();

  useEffect(() => {
    if (createSacrament.isOpen && createSacrament.sacramentType) {
      setSacramentType(createSacrament.sacramentType as SacramentType);
    }
  }, [createSacrament.isOpen, createSacrament.sacramentType]);

  const normalizedType =
    sacramentType === "holy_order" ? "holy_orders" : sacramentType;

  const SacramentForm = () => {
    switch (normalizedType) {
      case "baptism":
        return <BaptismForm formType="create" />;
      case "confirmation":
        return <ConfirmationForm formType="create" />;
      case "holy_eucharist":
        return <HolyCommunionForm formType="create" />;
      case "holy_orders":
        return <HolyOrdersForm formType="create" />;
      case "matrimony":
        return <MatrimonyForm formType="create" />;
      default:
        return <BaptismForm formType="create" />;
    }
  };

    const handleSacramentTypeChange = (value: SacramentType) => {
        setSacramentType(value);
    }
    return (
        <Dialog
            open={createSacrament.isOpen}
            onOpenChange={createSacrament.onOpenChange}
        >
            <DialogContent className="p-8 sm:max-w-2xl">
                <DialogHeader className="flex flex-row justify-between items-center w-full">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {createSacrament.sacramentType
                            ? sacramentNameFromType(
                                createSacrament.sacramentType as SacramentType,
                            )
                            : "Create new document"}
                    </DialogTitle>
                    <div>
                        <Select onValueChange={handleSacramentTypeChange} value={sacramentType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sacrament type" />
                            </SelectTrigger>
                            <SelectContent>
                                {sacramentTypes.map((sType, index) => (
                                    <SelectItem key={index} value={sType.sacrament_type}>
                                        {sacramentNameFromType(
                                            sType.sacrament_type as SacramentType,
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </DialogHeader>
                <Divider className="my-4" />
                <SacramentForm />

            </DialogContent>
        </Dialog>
    );
};

export default CreateSacramentDialog;
