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
  CreateMatrimonySacramentValues,
  sacramentKeyMap,
} from "./matrimony";
import ParishSelectWithSearch from "./ParishSelectWithSearch";

interface MatrimonyFormProps {
  formType: "create" | "edit";
  initialValues?: Matrimony;
}

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-4 w-full">{children}</div>
);

const DEFAULT_VALUES: CreateMatrimonySacramentValues = {
  [sacramentKeyMap.HusbandFirstName]: "",
  [sacramentKeyMap.HusbandLastName]: "",
  [sacramentKeyMap.HusbandID]: "",
  [sacramentKeyMap.WifeFirstName]: "",
  [sacramentKeyMap.WifeLastName]: "",
  [sacramentKeyMap.WifeID]: "",
  [sacramentKeyMap.DateMarried]: "",
  [sacramentKeyMap.ParishID]: "",
  [sacramentKeyMap.ParishName]: "",
  [sacramentKeyMap.OfficiatingPriest]: "",
  [sacramentKeyMap.Witness1]: "",
  [sacramentKeyMap.Witness2]: "",
};

const toDateString = (d: Date | string | undefined): string =>
  d instanceof Date ? d.toISOString().split("T")[0] ?? "" : (d ?? "");

const MatrimonyForm = ({ formType, initialValues }: MatrimonyFormProps) => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { parishes } = useParishesContext();
  const { createSacrament, editSacrament } = useArchiveDialogs();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);

  const initialFormValues = useMemo(() => {
    if (initialValues) {
      return {
        [sacramentKeyMap.HusbandFirstName]: initialValues.husband_first_name ?? "",
        [sacramentKeyMap.HusbandLastName]: initialValues.husband_last_name ?? "",
        [sacramentKeyMap.HusbandID]: initialValues.husband_id ?? "",
        [sacramentKeyMap.WifeFirstName]: initialValues.wife_first_name ?? "",
        [sacramentKeyMap.WifeLastName]: initialValues.wife_last_name ?? "",
        [sacramentKeyMap.WifeID]: initialValues.wife_id ?? "",
        [sacramentKeyMap.DateMarried]: initialValues.date_married ?? "",
        [sacramentKeyMap.ParishID]: initialValues.parish_id ?? "",
        [sacramentKeyMap.ParishName]: initialValues.parish_name ?? "",
        [sacramentKeyMap.OfficiatingPriest]: initialValues.officiating_priest ?? "",
        [sacramentKeyMap.Witness1]: initialValues.witness_1 ?? "",
        [sacramentKeyMap.Witness2]: initialValues.witness_2 ?? "",
      };
    }
    return DEFAULT_VALUES;
  }, [initialValues]);

  const validationSchema = yup.object().shape({
    [sacramentKeyMap.HusbandFirstName]: yup.string().required("Husband first name is required"),
    [sacramentKeyMap.HusbandLastName]: yup.string().required("Husband last name is required"),
    [sacramentKeyMap.WifeFirstName]: yup.string().required("Wife first name is required"),
    [sacramentKeyMap.WifeLastName]: yup.string().required("Wife last name is required"),
    [sacramentKeyMap.DateMarried]: yup.string().required("Date married is required"),
    [sacramentKeyMap.ParishID]: yup.string().required("Parish is required"),
  });

  const createMut = useMutation({
    mutationKey: ["create-matrimony"],
    mutationFn: (values: CreateMatrimonySacramentValues) =>
      apiClient.post("/sacraments/matrimony/new", values),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("A new matrimony has been uploaded");
        createSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to create matrimony");
    },
    onError: () => toast.error("Failed to create matrimony"),
  });

  const editMut = useMutation({
    mutationKey: ["update-matrimony", initialValues?.matrimony_id],
    mutationFn: (values: CreateMatrimonySacramentValues) =>
      apiClient.patch(
        `/sacraments/matrimony/${initialValues?.matrimony_id}`,
        values
      ),
    onSuccess: (data) => {
      if (data.status) {
        toastArchiveSuccess("Matrimony has been updated");
        editSacrament.onOpenChange(false);
        return;
      }
      toast.error("Failed to update matrimony");
    },
    onError: () => toast.error("Failed to update matrimony"),
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
        if (!initialValues?.matrimony_id) {
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
          label="Husband First Name"
          placeholder="Enter first name"
          value={formik.values[sacramentKeyMap.HusbandFirstName]}
          name={sacramentKeyMap.HusbandFirstName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.HusbandFirstName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.HusbandFirstName] &&
              !formik.errors[sacramentKeyMap.HusbandFirstName]
          )}
          onChange={formik.handleChange}
        />
        <Input
          label="Husband Last Name"
          placeholder="Enter last name"
          value={formik.values[sacramentKeyMap.HusbandLastName]}
          name={sacramentKeyMap.HusbandLastName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.HusbandLastName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.HusbandLastName] &&
              !formik.errors[sacramentKeyMap.HusbandLastName]
          )}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <Input
          label="Husband ID (optional)"
          placeholder="e.g. baptism or national ID"
          value={formik.values[sacramentKeyMap.HusbandID]}
          name={sacramentKeyMap.HusbandID}
          onChange={formik.handleChange}
        />
        <Input
          label="Wife First Name"
          placeholder="Enter first name"
          value={formik.values[sacramentKeyMap.WifeFirstName]}
          name={sacramentKeyMap.WifeFirstName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.WifeFirstName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.WifeFirstName] &&
              !formik.errors[sacramentKeyMap.WifeFirstName]
          )}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <Input
          label="Wife Last Name"
          placeholder="Enter last name"
          value={formik.values[sacramentKeyMap.WifeLastName]}
          name={sacramentKeyMap.WifeLastName}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.WifeLastName])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.WifeLastName] &&
              !formik.errors[sacramentKeyMap.WifeLastName]
          )}
          onChange={formik.handleChange}
        />
        <Input
          label="Wife ID (optional)"
          placeholder="e.g. baptism or national ID"
          value={formik.values[sacramentKeyMap.WifeID]}
          name={sacramentKeyMap.WifeID}
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
          label="Officiating Priest"
          placeholder="Enter priest's full name"
          value={formik.values[sacramentKeyMap.OfficiatingPriest]}
          name={sacramentKeyMap.OfficiatingPriest}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <Input
          label="Witness 1"
          placeholder="Enter witness full name"
          value={formik.values[sacramentKeyMap.Witness1]}
          name={sacramentKeyMap.Witness1}
          onChange={formik.handleChange}
        />
        <Input
          label="Witness 2"
          placeholder="Enter witness full name"
          value={formik.values[sacramentKeyMap.Witness2]}
          name={sacramentKeyMap.Witness2}
          onChange={formik.handleChange}
        />
      </FormRow>
      <FormRow>
        <DatePicker
          label="Date Married"
          name={sacramentKeyMap.DateMarried}
          isInvalid={Boolean(formik.errors[sacramentKeyMap.DateMarried])}
          isSuccess={Boolean(
            formik.touched[sacramentKeyMap.DateMarried] &&
              !formik.errors[sacramentKeyMap.DateMarried]
          )}
          dateValue={parseDateValue(formik.values[sacramentKeyMap.DateMarried])}
          onChange={(date) =>
            formik.setFieldValue(
              sacramentKeyMap.DateMarried,
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

export default MatrimonyForm;
