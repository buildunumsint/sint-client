/* eslint-disable  @typescript-eslint/no-explicit-any */
import moment from "moment";


const Dummy = { EMPTY_STRING: "------" };
export const timeMs = (timeInMin: number) => timeInMin * 60 * 100;

export const parseArray = (array: any): any[] => {
  if (Array.isArray(array)) return array;
  return [];
};

export const formatDate = (dateString: any) => {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).format("MMMM D, YYYY");
};

export function timeAgo(dateString: any) {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).fromNow();
}

export function createdAtAgoFull(dateString: any): string {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  const formattedDate = moment(dateString).format("h:mmA, MMMM D, YYYY");
  return `${formattedDate}`;
}

export function time24(dateString: any) {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).format("HH:mm");
}

export function dateStrokes(dateString: any) {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).format("DD/MM/YY");
}

export function dateStrokesFull(dateString: any) {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).format("DD/MM/YYYY");
}

export function updatedTimeFormat(dateString: any) {
  if (!dateString || typeof dateString !== "string") return Dummy.EMPTY_STRING;
  return moment(dateString).format("h:mma, D MMM");
}


export function firstName(fullname: any) {
  if (!fullname || typeof fullname !== "string") return Dummy.EMPTY_STRING;
  return fullname.split(" ")[0];
}

export function nameInitials(fullname: any) {
  if (!fullname || typeof fullname !== "string") return Dummy.EMPTY_STRING;
  return fullname.split(" ").map((name: any) => name.charAt(0).toUpperCase()).join("");
}

export function roleLabel(role: any) {
  if (!role || typeof role !== "string") return Dummy.EMPTY_STRING;
  return role==="client"?"Stakeholder":"My Team";
}

export const capitalizeFirstWord = (word: any) => {
  if (!word || typeof word !== "string") return Dummy.EMPTY_STRING;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export function formatDisplayName(creatorName: string | undefined, currentUserName: string | undefined): string {
  if (!creatorName) return Dummy.EMPTY_STRING;
  
  return creatorName === currentUserName 
    ? `Me (${firstName(creatorName)})`
    : firstName(creatorName);
}