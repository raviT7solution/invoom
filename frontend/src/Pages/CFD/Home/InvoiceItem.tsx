import { InvoiceQuery, InvoiceTypeEnum } from "../../../api/base";
import { formatAmount } from "../../../helpers";

export const InvoiceItem = ({
  invoiceType,
  item,
}: {
  invoiceType: InvoiceTypeEnum;
  item: InvoiceQuery["invoice"]["invoiceItems"][number];
}) => {
  return (
    <div className="m-1 rounded-lg bg-zinc-800 p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-neutral-400">
            {invoiceType === "simple"
              ? item.ticketItem.quantity
              : `${item.ticketItem.quantity}/${item.consumeBill}`}{" "}
            &times;{" "}
          </span>

          <span className="text-lg font-bold text-white">
            {item.ticketItem.name}
          </span>
        </div>

        <span className="text-neutral-400">
          {formatAmount(item.ticketItem.price)}
        </span>
      </div>

      {item.ticketItem.ticketItemAddons.map((i) => (
        <div className="flex justify-between" key={i.id}>
          <span className="text-neutral-400">{i.name}</span>
          <span className="text-neutral-400">{formatAmount(i.price)}</span>
        </div>
      ))}

      {item.ticketItem.modifiers.map((i, j) => (
        <div className="text-neutral-400" key={j}>
          {i}
        </div>
      ))}

      <div className="text-end text-lg font-bold text-white">
        {formatAmount(item.price)}
      </div>
    </div>
  );
};
