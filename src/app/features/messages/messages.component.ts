import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonPartsModule, BadgeType } from '@citadele/common-parts';
import { DataTableComponent, TableColumn } from '../orders/components/data-table.component';
import { UserFilterComponent } from './components/filters/user-filter.component';
import { MessageFilterComponent } from './components/filters/message-filter.component';
import { CustomerFilterComponent } from './components/filters/customer-filter.component';
import { ChannelFilterComponent } from './components/filters/channel-filter.component';
import { StatusFilterComponent } from './components/filters/status-filter.component';
import { DateFilterComponent } from './components/filters/date-filter.component';
import {
  Message,
  MessageSearchRequest,
  MessageUserFilter,
  MessageFilter,
  MessageCustomerFilter,
  MessageChannelFilter,
  MessageStatusFilter,
  MessageDateFilter,
  INITIAL_USER_FILTER,
  INITIAL_MESSAGE_FILTER,
  INITIAL_CUSTOMER_FILTER,
  INITIAL_CHANNEL_FILTER,
  INITIAL_STATUS_FILTER,
  INITIAL_DATE_FILTER,
} from '../../core/models/message.types';

@Component({
  selector: 'app-messages',
  imports: [
    FormsModule,
    CommonPartsModule,
    DataTableComponent,
    UserFilterComponent,
    MessageFilterComponent,
    CustomerFilterComponent,
    ChannelFilterComponent,
    StatusFilterComponent,
    DateFilterComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  // Filter state
  userFilter = signal<MessageUserFilter>({ ...INITIAL_USER_FILTER });
  messageFilter = signal<MessageFilter>({ ...INITIAL_MESSAGE_FILTER });
  customerFilter = signal<MessageCustomerFilter>({ ...INITIAL_CUSTOMER_FILTER });
  channelFilter = signal<MessageChannelFilter>({ ...INITIAL_CHANNEL_FILTER });
  statusFilter = signal<MessageStatusFilter>({ ...INITIAL_STATUS_FILTER });
  dateFilter = signal<MessageDateFilter>({ ...INITIAL_DATE_FILTER });

  // Table data
  messages = signal<Message[]>(MOCK_MESSAGES);
  totalCount = signal(MOCK_MESSAGES.length);

  // Table columns
  readonly tableColumns: TableColumn[] = [
    { key: 'postDate', title: 'Post date', width: '120px', sortable: true, type: 'date' },
    { key: 'loginName', title: 'Login name', width: '120px', sortable: true, type: 'text' },
    { key: 'message', title: 'Message', sortable: true, type: 'text' },
    { key: 'messageId', title: 'Message ID', width: '110px', sortable: true, type: 'text' },
    { key: 'officer', title: 'Officer', width: '110px', sortable: true, type: 'text' },
    {
      key: 'status', title: 'Status', width: '130px', sortable: true, type: 'badge',
      badgeType: (value: string) => this.getStatusBadgeType(value),
      formatter: (value: string) => this.formatStatus(value)
    },
    { key: 'class', title: 'Class', width: '90px', sortable: true, type: 'text' },
    { key: 'channel', title: 'Channel', width: '90px', sortable: true, type: 'text' },
    { key: 'segment', title: 'Segment', width: '100px', sortable: true, type: 'text' },
    { key: 'sector', title: 'Sector', width: '100px', sortable: true, type: 'text' },
    { key: 'employee', title: 'Employee', width: '120px', sortable: true, type: 'text' },
  ];

  onSearch(): void {
    const request: MessageSearchRequest = {
      user: this.userFilter(),
      message: this.messageFilter(),
      customer: this.customerFilter(),
      channel: this.channelFilter(),
      status: this.statusFilter(),
      date: this.dateFilter(),
    };
    console.log(JSON.stringify(request, null, 2));
  }

  onClearFilters(): void {
    this.userFilter.set({ ...INITIAL_USER_FILTER });
    this.messageFilter.set({ ...INITIAL_MESSAGE_FILTER });
    this.customerFilter.set({ ...INITIAL_CUSTOMER_FILTER });
    this.channelFilter.set({ ...INITIAL_CHANNEL_FILTER });
    this.statusFilter.set({ ...INITIAL_STATUS_FILTER });
    this.dateFilter.set({ ...INITIAL_DATE_FILTER });
  }

  onRowClick(row: Message): void {
    console.log('Selected message:', row.messageId);
  }

  private getStatusBadgeType(status: string): BadgeType {
    switch (status) {
      case 'NEW': return BadgeType.warning;
      case 'SEEN': return BadgeType.info;
      case 'ANSWERED_PARTLY': return BadgeType.info;
      case 'ANSWERED_AND_CLOSED': return BadgeType.success;
      case 'NOT_ANSWERED_AND_CLOSED': return BadgeType.error;
      default: return BadgeType.neutral;
    }
  }

  private formatStatus(status: string): string {
    switch (status) {
      case 'NEW': return 'New';
      case 'SEEN': return 'Seen';
      case 'ANSWERED_PARTLY': return 'Answered partly';
      case 'ANSWERED_AND_CLOSED': return 'Answered & closed';
      case 'NOT_ANSWERED_AND_CLOSED': return 'Not answered & closed';
      default: return status;
    }
  }
}

const MOCK_MESSAGES: Message[] = [
  {
    postDate: '2026-02-15T10:30:00Z',
    loginName: 'jsmith',
    message: 'Request for account statement for Q4 2025',
    messageId: 'MSG-001',
    officer: 'Officer 1',
    status: 'NEW',
    class: 'A',
    channel: 'WEB',
    segment: 'Retail',
    sector: 'Banking',
    employee: 'John Smith'
  },
  {
    postDate: '2026-02-14T14:15:00Z',
    loginName: 'ajonas',
    message: 'Currency exchange inquiry EUR/USD',
    messageId: 'MSG-002',
    officer: 'Officer 2',
    status: 'SEEN',
    class: 'B',
    channel: 'MOBILE',
    segment: 'Corporate',
    sector: 'Treasury',
    employee: 'Anna Jonas'
  },
  {
    postDate: '2026-02-13T09:00:00Z',
    loginName: 'mkruze',
    message: 'Payment processing issue - transaction #TX9928',
    messageId: 'MSG-003',
    officer: 'Officer 1',
    status: 'ANSWERED_PARTLY',
    class: 'A',
    channel: 'BRANCH',
    segment: 'Retail',
    sector: 'Operations',
    employee: 'Maria Kruze'
  },
  {
    postDate: '2026-02-12T16:45:00Z',
    loginName: 'pkovacs',
    message: 'Loan application follow-up documentation',
    messageId: 'MSG-004',
    officer: 'Officer 2',
    status: 'ANSWERED_AND_CLOSED',
    class: 'C',
    channel: 'WEB',
    segment: 'SME',
    sector: 'Lending',
    employee: 'Peter Kovacs'
  },
  {
    postDate: '2026-02-11T11:20:00Z',
    loginName: 'lbalode',
    message: 'Card block request - lost card notification',
    messageId: 'MSG-005',
    officer: 'Officer 1',
    status: 'NOT_ANSWERED_AND_CLOSED',
    class: 'A',
    channel: 'MOBILE',
    segment: 'Retail',
    sector: 'Cards',
    employee: 'Liga Balode'
  }
];
