export enum SuccessMessage {
  SUCCESS = "Success",
  SAVED = "saved successfully",
  CREATED = "created successfully",
  UPDATED = "updated successfully",
  DELETED = "deleted successfully",
  SIGNUP = "Sign up successful",
  SIGNOUT = "Sign out successful",
}

export type SuccessMessageKey = keyof typeof SuccessMessage;
