import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, Pagination } from "antd";
import { useMemo, useState, useEffect } from "react";

import { ConfigureMenu } from "./Config";
import { ITEM_STATUSES, TABS } from "./helpers";
import { Ticket } from "./Ticket";

import { TicketsQuery } from "../../../api/base";
import { consumer } from "../../../api/cable";
import {
  useKitchenProfile,
  useTicketItemsUpdate,
  useTickets,
} from "../../../api/kds";
import alertSound from "../../../assets/alert.wav";
import { useDebounceFn } from "../../../helpers/hooks";
import { useKDSConfigStore } from "../../../stores/useKDSConfigStore";
import { useKDSSessionStore } from "../../../stores/useKDSSessionStore";

const menuItems = TABS.map((i) => ({
  label: i.label,
  key: i.key,
}));

const notify = () => {
  const alert = new Audio(alertSound);

  alert.pause();
  alert.currentTime = 0;
  alert.play();
};

export const KDSHome = () => {
  const token = useKDSSessionStore((s) => s.token);
  const { restaurantId, bookingTypes, kitchenProfileId } = useKDSConfigStore();

  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("1");
  const [open, setOpen] = useState(false);

  const statuses = useMemo(
    () => TABS.find((i) => i.key === tab)?.statuses ?? [],
    [tab],
  );

  const { mutateAsync: updateTicketItem } = useTicketItemsUpdate();
  const { data: kitchenProfile } = useKitchenProfile(kitchenProfileId);
  const perPage = useMemo(
    () => (kitchenProfile ? kitchenProfile.columns * kitchenProfile.rows : 1),
    [kitchenProfile],
  );
  const {
    data: tickets,
    refetch: refetchTickets,
    isFetching,
  } = useTickets({
    bookingTypes: bookingTypes,
    kitchenProfileId: kitchenProfileId,
    page,
    perPage,
    restaurantId: restaurantId,
    status: statuses,
  });

  const debouncedNotify = useDebounceFn(notify, 500);
  const debouncedRefetch = useDebounceFn(refetchTickets, 100);

  useEffect(() => {
    if (!isFetching && tickets.collection.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [tickets, page, isFetching]);

  useEffect(() => {
    const channel = consumer.subscriptions.create(
      {
        channel: "TicketItemsChannel",
        Authorization: token,
        kitchen_profile_id: kitchenProfileId,
      },
      {
        received: (data: { event?: "ticket_create" }) => {
          if (data.event === "ticket_create" && kitchenProfile?.notify) {
            debouncedNotify();
          }

          debouncedRefetch();
        },
      },
    );

    return () => {
      channel.unsubscribe();
    };
  }, [
    debouncedNotify,
    debouncedRefetch,
    kitchenProfile?.notify,
    kitchenProfileId,
    token,
  ]);

  const updateTicketItemsStatusUpdate = (
    ticket: TicketsQuery["tickets"]["collection"][number],
    direction: 1 | -1,
    ticketItemId?: string,
  ) => {
    const items = ticketItemId
      ? ticket.ticketItems.filter((i) => i.id === ticketItemId)
      : ticket.ticketItems;

    const updatedItems = items.map((item) => {
      const newIdx = ITEM_STATUSES.indexOf(item.status) + direction;

      return {
        id: item.id,
        status: ITEM_STATUSES[newIdx] ?? item.status,
      };
    });

    updateTicketItem({ input: { attributes: updatedItems } });
  };

  return (
    <>
      <Drawer
        onClose={() => setOpen(false)}
        open={open}
        placement="left"
        title="Configure Menu"
      >
        <ConfigureMenu />
      </Drawer>

      <Layout className="h-screen">
        <Layout.Header className="!p-2.5 flex items-center justify-between">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
            size="large"
            type="primary"
          />

          <Menu
            items={menuItems}
            mode="horizontal"
            onClick={(e) => {
              setTab(e.key);
              setPage(1);
            }}
            selectedKeys={[tab]}
            theme="dark"
          />
        </Layout.Header>

        <Layout.Content>
          {kitchenProfile && (
            <div
              className="flex flex-wrap"
              style={{ height: `${100 / kitchenProfile.rows}%` }}
            >
              {tickets.collection.map((ticket) => (
                <div
                  className="h-full p-1.5"
                  key={ticket.id}
                  style={{ width: `${100 / kitchenProfile.columns}%` }}
                >
                  <Ticket
                    data={ticket}
                    isServed={tab === "5"}
                    showColor={tab === "1"}
                    updateStatus={(direction, ticketItemId) => {
                      updateTicketItemsStatusUpdate(
                        ticket,
                        direction,
                        ticketItemId,
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Layout.Content>

        <Layout.Footer className="text-center !py-2">
          <Pagination
            current={page}
            onChange={setPage}
            pageSize={perPage}
            showSizeChanger={false}
            total={tickets.metadata.totalCount}
          />
        </Layout.Footer>
      </Layout>
    </>
  );
};
