"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { useParishesContext } from "@/context/prefetch/ParishesContext";
import { createApiClientSecured } from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";
import { useArchiveDialogs } from "../../context/ArchiveDialogsContext";
import { toastArchiveSuccess } from "../../../../_shared/toast/ToastArchiveSuccess";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { useMemo } from "react";
import {
  CreateHolyCommunionSacramentValues,
  sacramentKeyMap,
} from "./holyCommunion";

interface HolyCommunionFormProps {
  formType: "create" | "edit";
  initialValues?: HolyCommunion;
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-4 w-full">{children}</div>
);

const DEFAULT_VALUES: CreateHolyCommunionSacramentValues = {
  [sacramentKeyMap.RecipientFirstName]: "",
  [sacramentKeyMap.RecipientLastName]: "",
  [sacramentKeyMap.DateReceived]: "",
  [sacramentKeyMap.ParishID]: "",
  [sacramentKeyMap.ParishName]: "",
  [sacramentKeyMap.OfficiatingPriest]: "",
  [sacramentKeyMap.Sponsor]: "",
};

const toDateString = (d: Date | string | undefined): string =>
  d instanceof Date ? d.toISOString().split("T")[0] ?? "" : (d ?? "");

const HolyCommunionForm = ({
  formType,
  initialValues,
}: HolyCommunionFormProps) => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { parishes } = useParishesContext();
  const { createSacrament, editSacrament } = useArchiveDialogs();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const initialFormValues = useMemo(() => {
    if (initialValues) {
      return {
        [sacramentKeyMap.RecipientFirstName]: initialValues.recipient_first_name ?? "",
        [sacramentKeyMap.RecipientLastName]: initialValues.recipient_last_name ?? "",
        [sacramentKeyMap.DateReceived]: initialValues.date_received ?? "",
        [sacramentKeyMap.ParishID]: initialValues.parish_id ?? "",
        [sacramentKeyMap.ParishName]: initialValues.parish_name ?? "",
        [sacramentKeyMap.OfficiatingPriest]: initialValues.officiating_priest ?? "",
        [sacramentKeyMap.Sponsor]: initialValues.sponsor ?? "",
      };
    }
    return DEFAULT_VALUES;
  }, [initialValues]);

  const validationSchema = yup.object().shape({
    [sacramentKeyMap.DateReceived]: yup.string().required("Date received is required"),
    [sacramentKeyMap.ParishID]: yup.string().required("Parish is required"),
  });

  const createMut = useMutation({
    mutationKey: ["create-holy-communion"],
    mutationFn: (values: CreateHolyCommunionSacramentValues) =>
      apiClient.post("/sacraments/holy_communion/new", values),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("A new Holy Communion record has been uploaded");
        createSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to create holy communion");
    },
    onError: () => toast.error("Failed to create holy communion"),
  });

  const editMut = useMutation({
    mutationKey: ["update-holy-communion", initialValues?.holy_communion_id],
    mutationFn: (values: CreateHolyCommunionSacramentValues) =>
      apiClient.patch(
        `/sacraments/holy_communion/${initialValues?.holy_communion_id}`,
        values
      ),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("Holy Communion has been updated");
        editSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to update holy communion");
    },
    onError: () => toast.error("Failed to update holy communion"),
  });

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const payload = { ...values };
      if (formType === "create") {
        createMut.mutate(payload);
      } else {
        if (!initialValues?.holy_communion_id) {
          toast.error("Record not found");
          return;
        }
        editMut.mutate(payload);
      }
    },
  });

  const parseDateValue = (date: string | undefined) =>
    date ? new Date(date) : undefined;

  const handleParishChange = (parishId: string) => {
    const parish = parishes.find((p) => p.parish_id === parishId);
    formik.setFieldValue(sacramentKeyMap.ParishID, parishId);
    formik.setFieldValue(sacramentKeyMap.ParishName, parish?.parish_name ?? "");
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4 items-center justify-center w-full"
    >
      <FormRow>
        <Input
          label="Recipient First Name"
          placeholder="Enter first name"
          value={formik.values[sacramentKeyMap.RecipientFirstName]}
          name={sacramentKeyMap.RecipientFirstName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.RecipientFirstName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.RecipientFirstName] &&
              !formik.errors[sacramentKeyMap.RecipientFirstName]
          )}
          onChange={formik.handleChange}
        />
        <Input
          label="Recipient Last Name"
          placeholder="Enter last name"
          value={formik.values[sacramentKeyMap.RecipientLastName]}
          name={sacramentKeyMap.RecipientLastName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.RecipientLastName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.RecipientLastName] &&
              !formik.errors[sacramentKeyMap.RecipientLastName]
          )}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <SelectGroup>
          <SelectLabel>Parish</SelectLabel>
          <Select
            name={sacramentKeyMap.ParishID}
            value={formik.values[sacramentKeyMap.ParishID]}
            onValueChange={handleParishChange}
          >
            <SelectTrigger
              isInvalid={Boolean(formik.errors[sacramentKeyMap.ParishID])}
              isSuccess={Boolean(
                formik.touched[sacramentKeyMap.ParishID] &&
                  !formik.errors[sacramentKeyMap.ParishID]
              )}
            >
              <SelectValue placeholder="Select a parish" />
            </SelectTrigger>
            <SelectContent>
              {parishes.map((parish) => (
                <SelectItem key={parish.parish_id} value={parish.parish_id}>
                  {parish.parish_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>
        <Input
          label="Officiating Priest"
          placeholder="Enter priest's full name"
          value={formik.values[sacramentKeyMap.OfficiatingPriest]}
          name={sacramentKeyMap.OfficiatingPriest}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.OfficiatingPriest])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.OfficiatingPriest] &&
              !formik.errors[sacramentKeyMap.OfficiatingPriest]
          )}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <Input
          label="Sponsor"
          placeholder="Enter sponsor's full name"
          value={formik.values[sacramentKeyMap.Sponsor]}
          name={sacramentKeyMap.Sponsor}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.Sponsor])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.Sponsor] &&
              !formik.errors[sacramentKeyMap.Sponsor]
          )}
          onChange={formik.handleChange}
        />
        <DatePicker
          label="Date Received"
          name={sacramentKeyMap.DateReceived}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.DateReceived])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.DateReceived] &&
              !formik.errors[sacramentKeyMap.DateReceived]
          )}
          dateValue={parseDateValue(formik.values[sacramentKeyMap.DateReceived])}
          onChange={(date) =>
            formik.setFieldValue(
              sacramentKeyMap.DateReceived,
              toDateString(date as Date)
            )
          }
        />
      </FormRow>
      <Button
        type="submit"
        size="xl"
        className="w-max bg-primary text-white"
        loading={createMut.isPending || editMut.isPending}
      >
        {formType === "create" ? "Create Sacrament" : "Update Sacrament"}
      </Button>
    </form>
  );
};

export default HolyCommunionForm;
