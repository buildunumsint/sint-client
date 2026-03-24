"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { createApiClientSecured } from "@/services/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as yup from "yup";
import { useArchiveDialogs } from "../../context/ArchiveDialogsContext";
import { toastArchiveSuccess } from "../../../../_shared/toast/ToastArchiveSuccess";

type CreateParishValues = {
  parish_name: string;
  location: string;
  priest_in_charge: string;
  contact_number: string;
  email: string;
};

const DEFAULT_VALUES: CreateParishValues = {
  parish_name: "",
  location: "",
  priest_in_charge: "",
  contact_number: "",
  email: "",
};

const validationSchema = yup.object().shape({
  parish_name: yup.string().required("Parish name is required"),
  location: yup.string().required("Location is required"),
  priest_in_charge: yup.string().required("Priest in charge is required"),
  contact_number: yup.string().required("Contact number is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
});

const ParishForm = () => {
  const { access_token, updateAccessToken } = useAuthContext();
  const { createParish } = useArchiveDialogs();
  const apiClient = createApiClientSecured(access_token, updateAccessToken);
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationKey: ["create-parish"],
    mutationFn: (values: CreateParishValues) => apiClient.post("/parishes/", values),
    onSuccess: async (data) => {
      if (data?.status) {
        toastArchiveSuccess("A new parish has been uploaded");
        await queryClient.invalidateQueries({ queryKey: ["parishes"] });
        createParish.onOpenChange(false);
        return;
      }
      toast.error("Failed to create parish");
    },
    onError: () => {
      toast.error("Failed to create parish");
    },
  });

  const formik = useFormik<CreateParishValues>({
    initialValues: DEFAULT_VALUES,
    validationSchema,
    onSubmit: (values) => {
      createMut.mutate(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex w-full flex-col items-center justify-center gap-4"
    >
      <Input
        label="Parish Name"
        placeholder="Enter parish name"
        name="parish_name"
        value={formik.values.parish_name}
        onChange={formik.handleChange}
        isInvalid={Boolean(formik.touched.parish_name && formik.errors.parish_name)}
        isSuccess={Boolean(formik.touched.parish_name && !formik.errors.parish_name)}
      />
      <Input
        label="Location"
        placeholder="Enter location"
        name="location"
        value={formik.values.location}
        onChange={formik.handleChange}
        isInvalid={Boolean(formik.touched.location && formik.errors.location)}
        isSuccess={Boolean(formik.touched.location && !formik.errors.location)}
      />
      <Input
        label="Priest In Charge"
        placeholder="Enter priest in charge"
        name="priest_in_charge"
        value={formik.values.priest_in_charge}
        onChange={formik.handleChange}
        isInvalid={Boolean(
          formik.touched.priest_in_charge && formik.errors.priest_in_charge,
        )}
        isSuccess={Boolean(
          formik.touched.priest_in_charge && !formik.errors.priest_in_charge,
        )}
      />
      <Input
        label="Contact Number"
        placeholder="Enter contact number"
        name="contact_number"
        value={formik.values.contact_number}
        onChange={formik.handleChange}
        isInvalid={Boolean(
          formik.touched.contact_number && formik.errors.contact_number,
        )}
        isSuccess={Boolean(
          formik.touched.contact_number && !formik.errors.contact_number,
        )}
      />
      <Input
        label="Email"
        placeholder="Enter parish email"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        isInvalid={Boolean(formik.touched.email && formik.errors.email)}
        isSuccess={Boolean(formik.touched.email && !formik.errors.email)}
      />

      <Button
        type="submit"
        size="xl"
        className="w-max bg-primary text-white"
        loading={createMut.isPending}
      >
        Create Parish
      </Button>
    </form>
  );
};

export default ParishForm;
