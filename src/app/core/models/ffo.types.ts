export interface FFODocument {
  ID: number;
  CLASS_ID: number;
  STATUS_ID: number;
  ORDER_DATE: string;
  DOCUMENT_NUMBER: string;
  CREATOR_CHANNEL_ID: number;
  LOGIN: string;
  FF_SUBJECT: string;
  WOC_ID: number;
  GLB_CUST_ID: number;
  SECTOR: number;
  SEGMENT: string;
  ISDOCUMENTATTACHED: number;
  CATEGORY_ID: number | null;
  SUBCATEGORY_ID: number | null;
  CATEGORY_NAME: string | null;
  SUBCATEGORY_NAME: string | null;
  ASSIGNEE: number | null;
  DOCUMENT_ATTACHED: number;
}

export interface FFOCategory {
  ID: number;
  NAME: string;
  PARENT_ID: number | null;
}

export interface CategorizeDocumentRequest {
  categoryId: number;
  subCategoryId?: number;
  assignee?: number;
}

export interface CategorizeDocumentResponse {
  success: boolean;
  documentId: number;
  categoryId: number;
  subCategoryId?: number;
  assignee?: number;
  result: number;
  message: string;
}

export interface UpdateProcessingStatusRequest {
  newStatus: number;
  comment?: string;
}

export interface UpdateProcessingStatusResponse {
  success: boolean;
  documentId: string;
  newStatus: number;
  result: number;
  message: string;
}

export interface FFOFilterParams {
  dateFrom?: string;
  dateTill?: string;
  documentNumber?: string;
  statusId?: number;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export function getFFOStatusText(statusId: number): string {
  switch (statusId) {
    case 1: return 'Pending';
    case 2: return 'In Review';
    case 3: return 'Processing';
    case 4: return 'Approved';
    case 5: return 'Rejected';
    default: return 'Unknown';
  }
}

export function getFFOStatusClass(statusId: number): string {
  switch (statusId) {
    case 1: return 'status-pending';
    case 2: return 'status-review';
    case 3: return 'status-processing';
    case 4: return 'status-approved';
    case 5: return 'status-rejected';
    default: return 'status-unknown';
  }
}

const DOC_TYPE_MAP: Map<number, string> = new Map([
  [1, 'EKS'],
  [2, 'Local SWIFT'],
  [3, 'Local German'],
  [4, 'International'],
  [5, 'Internal'],
  [6, 'Free form order'],
  [7, 'E-cheque'],
  [10, 'Card renewal orders'],
  [11, 'Card block orders'],
  [12, 'Card close orders due to loss'],
  [13, 'Card unblock orders'],
  [14, 'VSAA pension plans'],
  [15, 'To ones own account'],
  [16, 'Currency exchange'],
  [17, 'Card open orders, existing account'],
  [18, 'Card open orders, new account'],
  [19, 'Additional card open orders'],
  [22, 'Deposit to Financial Instruments Account'],
  [23, 'Withdrawal from PIGGY account'],
  [24, 'Deposit to PIGGY account'],
  [25, 'Salary internal'],
  [26, 'Salary local'],
  [30, 'Lattelekom'],
  [31, 'Lmt'],
  [32, 'Tele2'],
  [33, 'Baltkom Decoder'],
  [34, 'Latvijas Gaze'],
  [35, 'Latvenergo'],
  [36, 'IZZI'],
  [37, 'Baltkom Tikli'],
  [38, 'IZZI COM'],
  [39, 'LIVAS KTV'],
  [40, 'PROPANA GAZE'],
  [41, 'LIVAS NET'],
  [42, 'LIVAS'],
  [43, 'Baltkom TV'],
  [44, 'Zelta Zivtina'],
  [45, 'Real estate land'],
  [46, 'Real estate building'],
  [47, 'Riga real estate tax payment'],
  [48, 'Payment to pension fund'],
  [49, 'Administrative charges and other giro payments'],
  [50, 'BiFri'],
  [51, 'Latvenergo billing'],
  [52, 'ZetCom AMIGO'],
  [80, 'Deposit request'],
  [81, 'DDO update'],
  [82, 'DDO close'],
  [83, 'Create fixed amount internal STO'],
  [84, 'Create fixed amount EKS STO'],
  [85, 'Create balance outward internal STO'],
  [86, 'Create balance outward EKS STO'],
  [87, 'Create balance inward STO'],
  [88, 'Create revolving credit STO'],
  [107, 'SMS create'],
  [108, 'SMS update'],
  [109, 'SMS close'],
  [110, 'Natural person questionnaire'],
  [112, 'Mortgage loan order'],
  [113, 'VSAA application'],
  [114, 'VSAA closure'],
  [117, 'Tax payment EKS'],
  [118, 'Tax payment SWIFT'],
  [122, 'Internal Estonian'],
  [123, 'Local Estonian'],
  [124, 'Local SWIFT Estonian'],
  [133, 'Quick payment'],
  [134, 'EKS Mobile'],
  [135, 'Internal Mobile'],
  [137, 'E-Invoice payment'],
  [200, 'Create fixed amount internal EE STO'],
  [201, 'Create fixed amount Esta STO'],
  [300, 'PAM free form order'],
  [301, 'Stock free form order'],
  [302, 'Margin free form order'],
  [303, 'Investment fund share buy/sell order'],
  [304, 'Stock purchase/sale'],
  [305, 'Bond purchase/sale'],
  [306, 'Option purchase/sale'],
  [500, 'Replace card orders'],
  [501, 'Maxi accounts'],
  [502, 'Savings accounts'],
  [503, 'Flex deposit'],
  [508, 'ACCOUNT CLOSE'],
  [509, 'Salary register'],
  [515, 'LOAN APPLICATION'],
  [524, 'ATM CLAIM'],
  [526, 'Application for new card'],
  [527, 'CARD CLAIM'],
  [529, 'Auto loan'],
  [530, 'Refinancing'],
  [533, 'SMALL LOAN APPLICATION'],
  [700, 'Direct deposit (EE)'],
  [710, 'Consumer loan application'],
  [711, 'Home loan application'],
  [717, 'ACCOUNT OPEN MONO CURRENCY'],
  [718, 'ACCOUNT OPEN MULTI CURRENCY'],
  [719, 'CREDIT LIMIT INCREASE'],
  [723, 'MobileSCAN license activation'],
  [724, 'Add a new device'],
  [725, 'Mobile services cancellation order'],
  [731, 'PAYMENT CANCELLATION'],
  [732, 'PAYMENT INVESTIGATION'],
  [734, 'PAYMENT SWIFT DETAILS'],
  [769, 'Open Account for Minor'],
  [770, 'Minor Onboarding Order (MobApp)'],
  [771, 'Instant credit limit change'],
  [781, 'Application for preparation of reference'],
  [786, 'New payments plan application'],
  [787, 'Cancel payments plan'],
  [788, 'Change payments plan'],
  [793, 'Request money'],
  [794, "Submit 'Know Your Client' documents"],
  [796, 'Piggy open order'],
  [797, 'Piggy edit order'],
  [798, 'Guaranteed compensation application'],
  [1000, 'DE DIRECT DEPOSIT'],
  [1006, 'CREDIT CARD ORDER'],
  [1011, 'OPEN LOAN ONLINE'],
  [1012, 'OPEN CREDIT CARD ONLINE'],
  [1013, 'OPEN DEBIT CARD ONLINE'],
  [1200, 'Instant credit limit change'],
]);

export function getDocType(value: number): string {
  return DOC_TYPE_MAP.get(value) ?? '';
}

export interface DocumentType {
  id: number;
  name: string;
}

export function getAllDocumentTypes(): DocumentType[] {
  return Array.from(DOC_TYPE_MAP.entries()).map(([id, name]) => ({ id, name }));
}

export interface OrderDocType {
  label: string;
  value: string;
}

const ORDER_DOC_TYPE_IDS: { ids: number[]; labelOverride?: string }[] = [
  { ids: [6, 729, 731, 732, 734, 524, 527, 755, 764, 769, 770, 771, 781, 782, 783, 794, 798, 1200] },
  { ids: [6] },
  { ids: [731] },
  { ids: [732] },
  { ids: [734], labelOverride: 'Payment confirmation or SWIFT copy' },
  { ids: [524] },
  { ids: [527] },
  { ids: [769] },
  { ids: [770] },
  { ids: [771, 1200], labelOverride: 'Credit limit change' },
  { ids: [781], labelOverride: 'Reference preparation' },
  { ids: [794] },
  { ids: [798] },
];

export function getOrderDocTypes(): OrderDocType[] {
  return ORDER_DOC_TYPE_IDS.map(({ ids, labelOverride }) => {
    const label = ids.length === 1 && !labelOverride
      ? getDocType(ids[0])
      : (labelOverride || 'All');
    return { label, value: ids.join(',') };
  });
}

export interface OrderFilterData {
  documentTypeIds: string;
  subject: string;
  text: string;
}
