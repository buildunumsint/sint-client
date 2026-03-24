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
  CreateHolyOrdersSacramentValues,
  sacramentKeyMap,
} from "./holyOrders";

interface HolyOrdersFormProps {
  formType: "create" | "edit";
  initialValues?: HolyOrders;
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-4 w-full">{children}</div>
);

const ORDINATION_LEVELS = ["Deacon", "Priest", "Bishop"];

const DEFAULT_VALUES: CreateHolyOrdersSacramentValues = {
  [sacramentKeyMap.RecipientFirstName]: "",
  [sacramentKeyMap.RecipientLastName]: "",
  [sacramentKeyMap.OrdinationDate]: "",
  [sacramentKeyMap.ParishID]: "",
  [sacramentKeyMap.ParishName]: "",
  [sacramentKeyMap.OrdinationLevel]: "",
  [sacramentKeyMap.OrdainingBishop]: "",
};

const toDateString = (d: Date | string | undefined): string =>
  d instanceof Date ? d.toISOString().split("T")[0] ?? "" : (d ?? "");

const HolyOrdersForm = ({ formType, initialValues }: HolyOrdersFormProps) => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { parishes } = useParishesContext();
  const { createSacrament, editSacrament } = useArchiveDialogs();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const initialFormValues = useMemo(() => {
    if (initialValues) {
      return {
        [sacramentKeyMap.RecipientFirstName]: initialValues.recipient_first_name ?? "",
        [sacramentKeyMap.RecipientLastName]: initialValues.recipient_last_name ?? "",
        [sacramentKeyMap.OrdinationDate]: initialValues.ordination_date ?? "",
        [sacramentKeyMap.ParishID]: initialValues.parish_id ?? "",
        [sacramentKeyMap.ParishName]: initialValues.parish_name ?? "",
        [sacramentKeyMap.OrdinationLevel]: initialValues.ordination_level ?? "",
        [sacramentKeyMap.OrdainingBishop]: initialValues.ordaining_bishop ?? "",
      };
    }
    return DEFAULT_VALUES;
  }, [initialValues]);

  const validationSchema = yup.object().shape({
    [sacramentKeyMap.OrdinationDate]: yup.string().required("Ordination date is required"),
    [sacramentKeyMap.ParishID]: yup.string().required("Parish is required"),
    [sacramentKeyMap.OrdinationLevel]: yup.string().required("Ordination level is required"),
  });

  const createMut = useMutation({
    mutationKey: ["create-holy-orders"],
    mutationFn: (values: CreateHolyOrdersSacramentValues) =>
      apiClient.post("/sacraments/holy_orders/new", values),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("A new Holy Orders record has been uploaded");
        createSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to create holy orders");
    },
    onError: () => toast.error("Failed to create holy orders"),
  });

  const editMut = useMutation({
    mutationKey: ["update-holy-orders", initialValues?.holy_orders_id],
    mutationFn: (values: CreateHolyOrdersSacramentValues) =>
      apiClient.patch(
        `/sacraments/holy_orders/${initialValues?.holy_orders_id}`,
        values
      ),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("Holy Orders has been updated");
        editSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to update holy orders");
    },
    onError: () => toast.error("Failed to update holy orders"),
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
        if (!initialValues?.holy_orders_id) {
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
          <SelectLabel>Ordination Level</SelectLabel>
          <Select
            name={sacramentKeyMap.OrdinationLevel}
            value={formik.values[sacramentKeyMap.OrdinationLevel]}
            onValueChange={(value) =>
              formik.setFieldValue(sacramentKeyMap.OrdinationLevel, value)
            }
          >
            <SelectTrigger
              isInvalid={Boolean(formik.errors[sacramentKeyMap.OrdinationLevel])}
              isSuccess={Boolean(
                formik.touched[sacramentKeyMap.OrdinationLevel] &&
                  !formik.errors[sacramentKeyMap.OrdinationLevel]
              )}
            >
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {ORDINATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>
        <Input
          label="Ordaining Bishop"
          placeholder="Enter bishop's full name"
          value={formik.values[sacramentKeyMap.OrdainingBishop]}
          name={sacramentKeyMap.OrdainingBishop}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.OrdainingBishop])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.OrdainingBishop] &&
              !formik.errors[sacramentKeyMap.OrdainingBishop]
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
        <DatePicker
          label="Ordination Date"
          name={sacramentKeyMap.OrdinationDate}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.OrdinationDate])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.OrdinationDate] &&
              !formik.errors[sacramentKeyMap.OrdinationDate]
          )}
          dateValue={parseDateValue(formik.values[sacramentKeyMap.OrdinationDate])}
          onChange={(date) =>
            formik.setFieldValue(
              sacramentKeyMap.OrdinationDate,
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

export default HolyOrdersForm;
