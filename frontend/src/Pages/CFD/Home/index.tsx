import { LoadingOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { InvoiceItem } from "./InvoiceItem";
import { Layout } from "./Layout";

import { consumer } from "../../../api/cable";
import { useInvoice } from "../../../api/cfd";
import { formatAmount } from "../../../helpers";
import { useCFDConfigStore } from "../../../stores/useCFDConfigStore";
import { useCFDSessionStore } from "../../../stores/useCFDSessionStore";

export const CFDHome = () => {
  const queryClient = useQueryClient();

  const [invoiceId, setInvoiceId] = useState("");

  const deviceId = useCFDConfigStore((s) => s.deviceId);
  const token = useCFDSessionStore((s) => s.token);

  const invoice = useInvoice(invoiceId);

  const totalTip = useMemo(
    () => invoice.data?.payments.reduce((t, i) => t + i.tip, 0) ?? 0,
    [invoice],
  );

  useEffect(() => {
    const channel = consumer.subscriptions.create(
      {
        Authorization: token,
        channel: "CustomerFacingDisplayChannel",
        device_id: deviceId,
      },
      {
        received: (data: { invoice_id: string }) => {
          queryClient.invalidateQueries({
            queryKey: ["invoice", data.invoice_id],
          });

          setInvoiceId(data.invoice_id);
        },
      },
    );

    return () => {
      channel.unsubscribe();
    };
  }, [deviceId, queryClient, token]);

  return (
    <Layout>
      {invoiceId && (
        <div className="h-full w-full md:w-1/2 flex flex-col fixed right-0 bg-zinc-900">
          <div className="text-center p-2 text-xl text-rose-500 font-bold">
            Checkout
          </div>

          {!invoice.data ? (
            <div className="h-full flex justify-center items-center">
              <LoadingOutlined className="text-rose-500 text-5xl" />
            </div>
          ) : (
            <>
              <div className="overflow-y-scroll flex-1">
                {invoice.data.invoiceItems.map((i) => (
                  <InvoiceItem
                    invoiceType={invoice.data.invoiceType}
                    item={i}
                    key={i.id}
                  />
                ))}
              </div>

              {invoice.data.totalDiscount > 0 && (
                <div className="flex justify-between px-4 py-2">
                  <span className="text-rose-600">Discount</span>
                  <span className="text-rose-600">
                    {formatAmount(invoice.data.totalDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between px-4 py-2">
                <span className="text-white">Subtotal</span>
                <span className="text-white">
                  {formatAmount(invoice.data.subTotal)}
                </span>
              </div>

              {invoice.data.serviceChargeSummary.map((i, j) => (
                <div className="flex justify-between px-4 py-2" key={j}>
                  <span className="text-white">{i.name}</span>
                  <span className="text-white">{formatAmount(i.value)}</span>
                </div>
              ))}

              {invoice.data.taxSummary.map((i, j) => (
                <div className="flex justify-between px-4 py-2" key={j}>
                  <span className="text-white">{i.name}</span>
                  <span className="text-white">{formatAmount(i.value)}</span>
                </div>
              ))}

              {totalTip > 0 && (
                <div className="flex justify-between px-4 py-2">
                  <span className="text-white">Tip</span>
                  <span className="text-white">{formatAmount(totalTip)}</span>
                </div>
              )}

              <div className="flex justify-between px-4 py-2">
                <span className="text-green-500 text-lg font-bold">Total</span>
                <span className="text-green-500 text-lg font-bold">
                  {formatAmount(invoice.data.total)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};
