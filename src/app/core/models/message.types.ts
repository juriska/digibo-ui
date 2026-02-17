export type MessageStatus =
  | 'NEW'
  | 'SEEN'
  | 'ANSWERED_PARTLY'
  | 'ANSWERED_AND_CLOSED'
  | 'NOT_ANSWERED_AND_CLOSED';

export interface MessageUserFilter {
  nameSurname: string;
  loginName: string;
  officer: string;
}

export interface MessageFilter {
  messageId: string;
  messageText: string;
  messageClass: string;
  isQuestion: boolean;
  isAnswer: boolean;
}

export interface MessageCustomerFilter {
  customerId: string;
  customerName: string;
}

export interface MessageChannelFilter {
  channel: string;
}

export interface MessageStatusFilter {
  statuses: MessageStatus[];
}

export interface MessageDateFilter {
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface MessageSearchRequest {
  user?: MessageUserFilter;
  message?: MessageFilter;
  customer?: MessageCustomerFilter;
  channel?: MessageChannelFilter;
  status?: MessageStatusFilter;
  date?: MessageDateFilter;
}

export interface Message {
  postDate: string;
  loginName: string;
  message: string;
  messageId: string;
  officer: string;
  status: MessageStatus;
  class: string;
  channel: string;
  segment: string;
  sector: string;
  employee: string;
}

export const INITIAL_USER_FILTER: MessageUserFilter = {
  nameSurname: '',
  loginName: '',
  officer: ''
};

export const INITIAL_MESSAGE_FILTER: MessageFilter = {
  messageId: '',
  messageText: '',
  messageClass: '',
  isQuestion: false,
  isAnswer: false
};

export const INITIAL_CUSTOMER_FILTER: MessageCustomerFilter = {
  customerId: '',
  customerName: ''
};

export const INITIAL_CHANNEL_FILTER: MessageChannelFilter = {
  channel: ''
};

export const INITIAL_STATUS_FILTER: MessageStatusFilter = {
  statuses: []
};

export const INITIAL_DATE_FILTER: MessageDateFilter = {
  dateFrom: null,
  dateTo: null
};
