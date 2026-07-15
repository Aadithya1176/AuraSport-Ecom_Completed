import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const ORDER_STEPS = ["pending", "contacted", "confirmed", "packed", "shipped", "completed"];
const ORDER_LABELS = {
  pending: "Request sent",
  contacted: "Contact started",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled"
};
function OrderStatusBadge({ status }) {
  const tone = status === "completed" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" : status === "cancelled" ? "bg-rose-500/15 text-rose-300 border-rose-500/20" : "bg-primary/15 text-primary border-primary/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`, children: ORDER_LABELS[status] ?? status });
}
function OrderStatusTracker({ status }) {
  if (status === "cancelled") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200", children: "This request was cancelled. Submit a new request or contact AuraSport support if you still need these items." });
  }
  const currentIndex = Math.max(ORDER_STEPS.indexOf(status), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-6", children: ORDER_STEPS.map((step, index) => {
    const isDone = index <= currentIndex;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `rounded-[1.5rem] border p-4 text-center ${isDone ? "border-primary/30 bg-primary/10 text-foreground" : "border-white/10 bg-background/20 text-muted-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-black ${isDone ? "bg-primary text-primary-foreground" : "bg-white/10 text-muted-foreground"}`,
              children: index + 1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs font-semibold uppercase tracking-[0.18em]", children: ORDER_LABELS[step] })
        ]
      },
      step
    );
  }) });
}
export {
  OrderStatusBadge as O,
  OrderStatusTracker as a
};
