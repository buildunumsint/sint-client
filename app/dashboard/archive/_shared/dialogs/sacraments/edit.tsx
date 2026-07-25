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
import { useEffect, useMemo, useState } from "react";
import BaptismForm from "./BaptismForm";
import ConfirmationForm from "./ConfirmationForm";
import HolyCommunionForm from "./HolyCommunionForm";
import HolyOrdersForm from "./HolyOrdersForm";
import MatrimonyForm from "./MatrimonyForm";

const EditSacramentDialog = () => {
  const { editSacrament } = useArchiveDialogs();
  const [sacramentType, setSacramentType] = useState<SacramentType>(
    (editSacrament.sacramentType as SacramentType) ?? "baptism"
  );
  const { sacramentTypes } = useSacramentTypesContext();

  useEffect(() => {
    if (editSacrament.isOpen && editSacrament.sacramentType) {
      setSacramentType(editSacrament.sacramentType as SacramentType);
    }
  }, [editSacrament.isOpen, editSacrament.sacramentType]);

  const normalizedType =
    sacramentType === "holy_order" ? "holy_orders" : sacramentType;

  const SacramentForm = () =>
    useMemo(() => {
      switch (normalizedType) {
        case "baptism":
          return (
            <BaptismForm
              formType="edit"
              initialValues={editSacrament.initialValues as Baptism}
            />
          );
        case "confirmation":
          return (
            <ConfirmationForm
              formType="edit"
              initialValues={editSacrament.initialValues as Confirmation}
            />
          );
        case "holy_eucharist":
          return (
            <HolyCommunionForm
              formType="edit"
              initialValues={editSacrament.initialValues as HolyCommunion}
            />
          );
        case "holy_orders":
          return (
            <HolyOrdersForm
              formType="edit"
              initialValues={editSacrament.initialValues as HolyOrders}
            />
          );
        case "matrimony":
          return (
            <MatrimonyForm
              formType="edit"
              initialValues={editSacrament.initialValues as Matrimony}
            />
          );
        default:
          return (
            <BaptismForm
              formType="edit"
              initialValues={editSacrament.initialValues as Baptism}
            />
          );
      }
    }, [sacramentType, editSacrament.initialValues]);

    const handleSacramentTypeChange = (value: SacramentType) => {
        setSacramentType(value);
    }
    return (
        <Dialog
            open={editSacrament.isOpen}
            onOpenChange={editSacrament.onOpenChange}
        >
            <DialogContent className="p-8 sm:max-w-2xl">
                <DialogHeader className="flex flex-row justify-between items-center w-full">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {editSacrament.sacramentType
                            ? sacramentNameFromType(
                                editSacrament.sacramentType as SacramentType,
                            )
                            : "Create new document"}
                    </DialogTitle>
                    <div>
                        <Select disabled={true} onValueChange={handleSacramentTypeChange} value={sacramentType}>
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

export default EditSacramentDialog;
