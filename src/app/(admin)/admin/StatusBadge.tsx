import { CheckCircle2, Clock, XCircle } from 'lucide-react';

type Status = 'pending' | 'fulfilled' | 'fulfillment_failed';

const MAP: Record<Status, { label: string; cls: string; icon: React.ReactNode }> = {
  fulfilled: {
    label: 'Fulfilled',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  pending: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  fulfillment_failed: {
    label: 'Failed',
    cls: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const m = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
};
