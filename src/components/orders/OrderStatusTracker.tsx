import type { OrderStatus } from "@/lib/api";

const ORDER_STEPS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const tone =
    status === "completed"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : status === "cancelled"
        ? "bg-rose-500/15 text-rose-300 border-rose-500/20"
        : "bg-primary/15 text-primary border-primary/20";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`}>
      {ORDER_LABELS[status as OrderStatus] ?? status}
    </span>
  );
}

export function OrderStatusTracker({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
        This request was cancelled. Submit a new request or contact AuraSport support if you still need these items.
      </div>
    );
  }

  const currentIndex = Math.max(ORDER_STEPS.indexOf(status as OrderStatus), 0);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {ORDER_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        return (
          <div
            key={step}
            className={`rounded-[1.5rem] border p-4 text-center ${
              isDone ? "border-primary/30 bg-primary/10 text-foreground" : "border-white/10 bg-background/20 text-muted-foreground"
            }`}
          >
            <div
              className={`mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                isDone ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em]">
              {ORDER_LABELS[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
