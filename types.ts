export type availableBanks =
  | "9PSB"
  | "SAFEHAVEN"
  | "PROVIDUS"
  | "BANKLY"
  | "PALMPAY";

export interface accountDetailsTypes {
  accountNumber: string;
  accountName: string;
  bankName: availableBanks;
  bankCode: string;
  accountRef: string;
  expirationDate: string;
}

export interface dedicatedAccountNumber {
  accountDetails: accountDetailsTypes;
  user: string;
  hasDedicatedAccountNumber: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  order_ref: string;
}

export interface generatedBankAccount {
  account_number: string;
  account_name: string;
  bank_name: availableBanks;
  bank_id: availableBanks;
  created_at: string;
}

export interface createDedicatedVirtualAccountResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    account: generatedBankAccount[];
    meta: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  err?: any;
}

export interface createDedicatedAccountProps {
  email: string;
  reference: string;
  firstName: string;
  lastName: string;
  phone: string;
  bank: availableBanks;
}

//TRANSACTIONS

export type transactionStatus = "success" | "failed" | "pending";
export type transactionType =
  | "funding"
  | "airtime"
  | "data"
  | "bill"
  | "recharge-card"
  | "exam";
export type paymentMethod =
  | "dedicatedAccount"
  | "virtualAccount"
  | "ownAccount";

export interface transaction<T = any> {
  amount: number;
  tx_ref: string;
  user: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  status: transactionStatus;
  type: transactionType;
  paymentMethod: paymentMethod;
  accountId?: string;
  meta?: T;
  _id?: string;
}

//USERS
export type IUserRole = "user" | "admin";
export type accountStatus = "active" | "inactive";

export interface IUser extends Document {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  balance: number;
  canUserMakeTransaction?: boolean;
  auth: {
    email: string;
    password: string;
    transactionPin: string;
  };
  role: IUserRole;
  createdAt?: string;
  updatedAt?: string;
  hasSetPin: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: accountStatus;
  refCode?: string;

  verifyTransactionPin: (pin: string) => Promise<boolean>;
  verifyUserBalance: (amount: number) => Promise<void>;
  sendResetPasswordToken: () => Promise<void>;
  verifyResetPasswordToken: (token: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<void>;
}
