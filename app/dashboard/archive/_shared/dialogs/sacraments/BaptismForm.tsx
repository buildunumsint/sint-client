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
import { CreateBaptismSacramentValues, sacramentKeyMap } from "./baptism";
import ParishSelectWithSearch from "./ParishSelectWithSearch";

interface BaptismFormProps {
    formType: "create" | "edit";
    //   sacramentType: SacramentType;
    initialValues?: Baptism;
}

//const gendr
enum Gender {
    male = "male",
    female = "female"
}
const FormRow = ({ children }: { children: React.ReactNode }) => {
    return <div className="grid grid-cols-2 gap-4 w-full">{children}</div>;
};
const DEFAULT_VALUES = {
    [sacramentKeyMap.DateBaptized]: undefined,
    [sacramentKeyMap.ParishID]: "",
    [sacramentKeyMap.ParishName]: "",
    [sacramentKeyMap.BaptismalName]: "",
    [sacramentKeyMap.OfficiatingPriest]: "",
    [sacramentKeyMap.GodParent]: "",
    [sacramentKeyMap.FatherFullName]: "",
    [sacramentKeyMap.MotherFullName]: "",
    [sacramentKeyMap.RecipientFirstName]: "",
    [sacramentKeyMap.RecipientLastName]: "",
    [sacramentKeyMap.Gender]: "",
    [sacramentKeyMap.DateOfBirth]: "",
};

const BaptismForm = ({ formType, initialValues }: BaptismFormProps) => {
    const { access_token, updateAccessToken } = useAuthContext();
    const { parishes } = useParishesContext();
    const { createSacrament, editSacrament, triggerSacramentRefetch } = useArchiveDialogs();
    const apiClient = createApiClientSecured(access_token, updateAccessToken);
    const initialFormValues = useMemo(() => {
        if (initialValues) {
            return {
                [sacramentKeyMap.DateBaptized]: initialValues.date_baptized as string,
                [sacramentKeyMap.ParishID]: initialValues.parish_id as string,
                [sacramentKeyMap.ParishName]: initialValues.parish_name as string,
                [sacramentKeyMap.BaptismalName]: initialValues.baptismal_name as string,
                [sacramentKeyMap.OfficiatingPriest]: initialValues.officiating_priest as string,
                [sacramentKeyMap.GodParent]: initialValues.god_parent as string,
                [sacramentKeyMap.FatherFullName]: initialValues.father_full_name as string,
                [sacramentKeyMap.MotherFullName]: initialValues.mother_full_name as string,
                [sacramentKeyMap.RecipientFirstName]: initialValues.recipient_first_name as string,
                [sacramentKeyMap.RecipientLastName]: initialValues.recipient_last_name as string,
                [sacramentKeyMap.Gender]: initialValues.gender as string,
                [sacramentKeyMap.DateOfBirth]: initialValues.date_of_birth as string,
            };
        }
        return DEFAULT_VALUES;
    }, [initialValues]);
    const validationSchema = yup.object().shape({
        [sacramentKeyMap.DateBaptized]: yup
            .date()
            .nullable()
            .required("Date baptized is required"),
        [sacramentKeyMap.ParishID]: yup.string().required("Parish ID is required"),
        // [sacramentKeyMap.ParishName]: yup
        //     .string()
        //     .required("Parish name is required"),//only required if the parish is not selected
        [sacramentKeyMap.BaptismalName]: yup
            .string()
            .required("Baptismal name is required"),
        [sacramentKeyMap.OfficiatingPriest]: yup
            .string()
            .required("Officiating priest is required"),
        [sacramentKeyMap.GodParent]: yup.string().required("Godparent is required"),
        [sacramentKeyMap.RecipientFirstName]: yup
            .string()
            .required("Recipient first name is required"),
        [sacramentKeyMap.RecipientLastName]: yup
            .string()
            .required("Recipient last name is required"),
        [sacramentKeyMap.Gender]: yup.string().required("Gender is required"),
        [sacramentKeyMap.DateOfBirth]: yup
            .string()
            .required("Date of birth is required"),
        [sacramentKeyMap.FatherFullName]: yup
            .string()
            .required("Father's full name is required"),
        [sacramentKeyMap.MotherFullName]: yup
            .string()
            .required("Mother's full name is required"),
    });

    const createMut = useMutation({
        mutationKey: ["create-baptism"],
        mutationFn: (values: CreateBaptismSacramentValues) => {
            return apiClient.post(`/sacraments/baptism/new`, values);
        },
        onSuccess: (data) => {
            if (data.status) {
                console.log(data);
                toastArchiveSuccess("A new baptism has been uploaded");
                triggerSacramentRefetch("baptism");
                createSacrament.onOpenChange(false);
                return;
            }
            toast.error("Failed to create sacrament");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to create sacrament");
        },
    });

    const editMut = useMutation({
        mutationKey: ["update-baptism", initialValues?.baptism_id],
        mutationFn: (values: CreateBaptismSacramentValues) => {
            return apiClient.patch(`/sacraments/baptism/${initialValues?.baptism_id}`, values);
        },
        onSuccess: (data) => {
            if (data.status) {
                console.log(data);
                toastArchiveSuccess("Baptism has been updated");
                triggerSacramentRefetch("baptism");
                editSacrament.onOpenChange(false);
                return;
            }
            toast.error("Failed to update sacrament");
        },
        onError: (error) => {
            console.log(error);
            toast.error("Failed to update sacrament");
        },
    });

    const formik = useFormik({
        initialValues: initialFormValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (formType === "create") {
                createMut.mutate(values);
            } else {
                if (!initialValues?.baptism_id) {
                    toast.error("Sacrament not found");
                    return;
                }
                editMut.mutate(values);
            }
        },
    });

    const parseDateValue = (date: string | undefined) => {
        if (!date) return undefined;
        return new Date(date);
    }

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 items-center justify-center w-full"
        >
            <FormRow>
                <Input
                    label="Recipient First Name"
                    placeholder="Enter the firstname"
                    value={formik.values[sacramentKeyMap.RecipientFirstName]}
                    name={sacramentKeyMap.RecipientFirstName}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.RecipientFirstName])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.RecipientFirstName] &&
                        !formik.errors[sacramentKeyMap.RecipientFirstName],
                    )}
                    onChange={formik.handleChange}
                />
                <Input
                    label="Recipient Last Name"
                    placeholder="Enter the Lastname"
                    value={formik.values[sacramentKeyMap.RecipientLastName]}
                    name={sacramentKeyMap.RecipientLastName}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.RecipientLastName])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.RecipientLastName] &&
                        !formik.errors[sacramentKeyMap.RecipientLastName],
                    )}
                    onChange={formik.handleChange}
                />
            </FormRow>
            <FormRow>
                <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <Select
                        name={sacramentKeyMap.Gender}
                        value={formik.values[sacramentKeyMap.Gender]}
                        onValueChange={(value) =>
                            formik.setFieldValue(sacramentKeyMap.Gender, value)
                        }
                    >
                        <SelectTrigger
                            isInvalid={Boolean(formik.errors[sacramentKeyMap.Gender])}
                            isSuccess={Boolean(
                                formik.touched[sacramentKeyMap.Gender] &&
                                !formik.errors[sacramentKeyMap.Gender],
                            )}
                        >
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(Gender).map((gender, index) => (
                                <SelectItem key={index} value={gender}>
                                    {gender}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </SelectGroup>
                <DatePicker
                    label="Date of Birth"
                    name={sacramentKeyMap.DateOfBirth}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.DateOfBirth])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.DateOfBirth] &&
                        !formik.errors[sacramentKeyMap.DateOfBirth],
                    )}
                    dateValue={parseDateValue(formik.values[sacramentKeyMap.DateOfBirth])}
                    onChange={(date) =>
                        formik.setFieldValue(sacramentKeyMap.DateOfBirth, date as Date)
                    }
                />
            </FormRow>
            <FormRow>
                <Input
                    label="Baptismal Name"
                    placeholder="Enter the Baptismal Name"
                    value={formik.values[sacramentKeyMap.BaptismalName]}
                    name={sacramentKeyMap.BaptismalName}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.BaptismalName])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.BaptismalName] &&
                        !formik.errors[sacramentKeyMap.BaptismalName],
                    )}
                    onChange={formik.handleChange}
                />
                <Input
                    label="Sponsor"
                    placeholder="Enter Sponsor's Full Name"
                    value={formik.values[sacramentKeyMap.GodParent]}
                    name={sacramentKeyMap.GodParent}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.GodParent])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.GodParent] &&
                        !formik.errors[sacramentKeyMap.GodParent],
                    )}
                    onChange={formik.handleChange}
                />
            </FormRow>
            <FormRow>
                <Input
                    label="Father's Name"
                    placeholder="Enter Father's Full Name"
                    value={formik.values[sacramentKeyMap.FatherFullName]}
                    name={sacramentKeyMap.FatherFullName}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.FatherFullName])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.FatherFullName] &&
                        !formik.errors[sacramentKeyMap.FatherFullName],
                    )}
                    onChange={formik.handleChange}
                />
                <Input
                    label="Mother's Name"
                    placeholder="Enter Mother's Full Name"
                    value={formik.values[sacramentKeyMap.MotherFullName]}
                    name={sacramentKeyMap.MotherFullName}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.MotherFullName])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.MotherFullName] &&
                        !formik.errors[sacramentKeyMap.MotherFullName],
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
                        value={formik.values[sacramentKeyMap.ParishID] ?? ""}
                        onValueChange={(value) =>
                            formik.setFieldValue(sacramentKeyMap.ParishID, value)
                        }
                        isInvalid={Boolean(formik.errors[sacramentKeyMap.ParishID])}
                        isSuccess={Boolean(
                            formik.touched[sacramentKeyMap.ParishID] &&
                            !formik.errors[sacramentKeyMap.ParishID],
                        )}
                    />
                </SelectGroup>
                <Input
                    label="Minister "
                    placeholder="Enter the Minister's Full Name"
                    value={formik.values[sacramentKeyMap.OfficiatingPriest]}
                    name={sacramentKeyMap.OfficiatingPriest}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.OfficiatingPriest])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.OfficiatingPriest] &&
                        !formik.errors[sacramentKeyMap.OfficiatingPriest],
                    )}
                    onChange={formik.handleChange}
                />
            </FormRow>
            <FormRow>

                <  DatePicker
                    label="Date Baptized"
                    name={sacramentKeyMap.DateBaptized}
                    isInvalid={Boolean(formik.errors[sacramentKeyMap.DateBaptized])}
                    isSuccess={Boolean(
                        formik.touched[sacramentKeyMap.DateBaptized] &&
                        !formik.errors[sacramentKeyMap.DateBaptized],
                    )}
                    dateValue={parseDateValue(formik.values[sacramentKeyMap.DateBaptized])}
                    onChange={(date) =>
                        formik.setFieldValue(sacramentKeyMap.DateBaptized, date as Date)
                    }
                />
            </FormRow>
            <Button type="submit" size="xl" className="w-max bg-primary text-white" loading={createMut.isPending || editMut.isPending}>
                {formType === "create" ? "Create Sacrament" : "Update Sacrament"}
            </Button>
        </form>
    );
};

export default BaptismForm;
