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
    <div className="rounded-lg p-3 m-1 bg-zinc-800">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-neutral-400 text-lg font-bold">
            {invoiceType === "simple"
              ? item.ticketItem.quantity
              : `${item.ticketItem.quantity}/${item.consumeBill}`}{" "}
            &times;{" "}
          </span>

          <span className="text-white text-lg font-bold">
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

      <div className="text-lg text-white text-end font-bold">
        {formatAmount(item.price)}
      </div>
    </div>
  );
};
