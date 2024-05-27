import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, Pagination } from "antd";
import { useMemo, useState } from "react";

import { ConfigureMenu } from "./Config";
import { ITEM_STATUSES, TABS } from "./helpers";
import { Ticket } from "./Ticket";

import { TicketsQuery } from "../../../api/base";
import { useTicketItemsUpdate, useTickets } from "../../../api/kds";
import { useKDSConfigStore } from "../../../stores/useKDSConfigStore";

const menuItems = TABS.map((i) => ({
  label: i.label,
  key: i.key,
}));

const dimensionX = 3;
const dimensionY = 2;
const perPage = dimensionX * dimensionY;

export const KDSHome = () => {
  const restaurantId = useKDSConfigStore((s) => s.restaurantId);

  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("1");
  const [open, setOpen] = useState(false);

  const statuses = useMemo(
    () => TABS.find((i) => i.key === tab)?.statuses ?? [],
    [tab],
  );

  const { mutateAsync: updateTicketItem } = useTicketItemsUpdate();
  const { data: tickets } = useTickets({
    page,
    perPage,
    restaurantId: restaurantId,
    status: statuses,
  });

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
          <div
            className="flex flex-wrap"
            style={{ height: `${100 / dimensionY}%` }}
          >
            {tickets.collection.map((ticket) => (
              <div
                className="h-full p-1.5"
                key={ticket.id}
                style={{ width: `${100 / dimensionX}%` }}
              >
                <Ticket
                  data={ticket}
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
        </Layout.Content>

        <Layout.Footer className="text-center !py-2">
          <Pagination
            current={page}
            defaultPageSize={perPage}
            onChange={setPage}
            showSizeChanger={false}
            total={tickets.metadata.totalCount}
          />
        </Layout.Footer>
      </Layout>
    </>
  );
};
