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
  CreateConfirmationSacramentValues,
  sacramentKeyMap,
} from "./confirmation";
import ParishSelectWithSearch from "./ParishSelectWithSearch";

interface ConfirmationFormProps {
  formType: "create" | "edit";
  initialValues?: Confirmation;
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-4 w-full">{children}</div>
);

const DEFAULT_VALUES: CreateConfirmationSacramentValues = {
  [sacramentKeyMap.RecipientFirstName]: "",
  [sacramentKeyMap.RecipientLastName]: "",
  [sacramentKeyMap.DateConfirmed]: "",
  [sacramentKeyMap.ParishID]: "",
  [sacramentKeyMap.ParishName]: "",
  [sacramentKeyMap.ConfirmationName]: "",
  [sacramentKeyMap.Sponsor]: "",
  [sacramentKeyMap.OfficiatingBishop]: "",
};

const toDateString = (d: Date | string | undefined): string =>
  d instanceof Date ? d.toISOString().split("T")[0] ?? "" : (d ?? "");

const ConfirmationForm = ({ formType, initialValues }: ConfirmationFormProps) => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { parishes } = useParishesContext();
  const { createSacrament, editSacrament } = useArchiveDialogs();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const initialFormValues = useMemo(() => {
    if (initialValues) {
      return {
        [sacramentKeyMap.RecipientFirstName]: initialValues.recipient_first_name ?? "",
        [sacramentKeyMap.RecipientLastName]: initialValues.recipient_last_name ?? "",
        [sacramentKeyMap.DateConfirmed]: initialValues.date_confirmed ?? "",
        [sacramentKeyMap.ParishID]: initialValues.parish_id ?? "",
        [sacramentKeyMap.ParishName]: initialValues.parish_name ?? "",
        [sacramentKeyMap.ConfirmationName]: initialValues.confirmation_name ?? "",
        [sacramentKeyMap.Sponsor]: initialValues.sponsor ?? "",
        [sacramentKeyMap.OfficiatingBishop]: initialValues.officiating_bishop ?? "",
      };
    }
    return DEFAULT_VALUES;
  }, [initialValues]);

  const validationSchema = yup.object().shape({
    [sacramentKeyMap.DateConfirmed]: yup.string().required("Date confirmed is required"),
    [sacramentKeyMap.ParishID]: yup.string().required("Parish is required"),
    [sacramentKeyMap.ConfirmationName]: yup.string().required("Confirmation name is required"),
  });

  const createMut = useMutation({
    mutationKey: ["create-confirmation"],
    mutationFn: (values: CreateConfirmationSacramentValues) =>
      apiClient.post("/sacraments/confirmation/new", values),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("A new confirmation has been uploaded");
        createSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to create confirmation");
    },
    onError: () => toast.error("Failed to create confirmation"),
  });

  const editMut = useMutation({
    mutationKey: ["update-confirmation", initialValues?.confirmation_id],
    mutationFn: (values: CreateConfirmationSacramentValues) =>
      apiClient.patch(`/sacraments/confirmation/${initialValues?.confirmation_id}`, values),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("Confirmation has been updated");
        editSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to update confirmation");
    },
    onError: () => toast.error("Failed to update confirmation"),
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
        if (!initialValues?.confirmation_id) {
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
        <Input
          label="Confirmation Name"
          placeholder="Enter confirmation name"
          value={formik.values[sacramentKeyMap.ConfirmationName]}
          name={sacramentKeyMap.ConfirmationName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.ConfirmationName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.ConfirmationName] &&
              !formik.errors[sacramentKeyMap.ConfirmationName]
          )}
          onChange={formik.handleChange}
        />
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
      </FormRow>
      <FormRow>
        <SelectGroup>
          <SelectLabel>Parish</SelectLabel>
          <ParishSelectWithSearch
            parishes={parishes}
            name={sacramentKeyMap.ParishID}
            value={formik.values[sacramentKeyMap.ParishID]}
            onValueChange={handleParishChange}
            isInvalid={Boolean(formik.errors[sacramentKeyMap.ParishID])}
            isSuccess={Boolean(
              formik.touched[sacramentKeyMap.ParishID] &&
                !formik.errors[sacramentKeyMap.ParishID]
            )}
          />
        </SelectGroup>
        <Input
          label="Officiating Bishop"
          placeholder="Enter bishop's full name"
          value={formik.values[sacramentKeyMap.OfficiatingBishop]}
          name={sacramentKeyMap.OfficiatingBishop}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.OfficiatingBishop])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.OfficiatingBishop] &&
              !formik.errors[sacramentKeyMap.OfficiatingBishop]
          )}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          label="Date Confirmed"
          name={sacramentKeyMap.DateConfirmed}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.DateConfirmed])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.DateConfirmed] &&
              !formik.errors[sacramentKeyMap.DateConfirmed]
          )}
          dateValue={parseDateValue(formik.values[sacramentKeyMap.DateConfirmed])}
          onChange={(date) =>
            formik.setFieldValue(
              sacramentKeyMap.DateConfirmed,
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

export default ConfirmationForm;
