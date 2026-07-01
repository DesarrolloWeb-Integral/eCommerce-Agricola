import type { OrderStatus } from '../types';

const STATUS_CLASS_BY_VALUE: Record<OrderStatus, string> = {
  CANCELADO: 'text-bg-danger',
  CONFIRMADO: 'text-bg-success',
  PENDIENTE: 'text-bg-warning',
};

const STATUS_ICON_BY_VALUE: Record<OrderStatus, string> = {
  CANCELADO: 'bi-x-circle',
  CONFIRMADO: 'bi-check2-circle',
  PENDIENTE: 'bi-clock-history',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${STATUS_CLASS_BY_VALUE[status]}`}
    >
      <i className={`bi ${STATUS_ICON_BY_VALUE[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}
