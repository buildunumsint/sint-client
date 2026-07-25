type ReqResponseType = {
  success: boolean;
  data?: any;
  message: string;
};

type ContentType = "form" | "json";

interface SuccessResponse {
  status: boolean;
  message: string;
  data: any | null;
  other?: any;
}
interface ErrorResponse {
  status: boolean;
  message: string;
  data: any | null;
  other?: any;
}

type SetAccessToken = (token: string) => void;