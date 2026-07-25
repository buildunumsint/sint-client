"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArchiveDialogs } from "../../context/ArchiveDialogsContext";
import Divider from "@/components/ui/divider";
import ParishForm from "./ParishForm";

const CreateParishDialog = () => {
  const { createParish } = useArchiveDialogs();

  return (
    <Dialog open={createParish.isOpen} onOpenChange={createParish.onOpenChange}>
      <DialogContent className="p-8 sm:max-w-2xl">
        <DialogHeader className="flex flex-row justify-between items-center w-full">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Create new parish
          </DialogTitle>
          <div></div>
        </DialogHeader>
        <Divider className="my-4" />
        <ParishForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateParishDialog;
